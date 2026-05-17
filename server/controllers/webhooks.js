import { Webhook } from "svix";
import { catchError } from "../utils/catchError.js";
import UserModel from "../models/User.js";
import PurchaseModel from "../models/Purchase.js";
import Stripe from "stripe";
import CourseModel from "../models/Course.js";

export const clerkWebhooks = catchError(async (req, res) => {
  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

  const payload = JSON.stringify(req.body);

  const headers = {
    "svix-id": req.headers["svix-id"],
    "svix-timestamp": req.headers["svix-timestamp"],
    "svix-signature": req.headers["svix-signature"],
  };

  const event = webhook.verify(payload, headers);

  const { data, type } = event;

  switch (type) {
    case "user.created": {
      await UserModel.create({
        _id: data.id,
        name: `${data.first_name} ${data.last_name}`,
        email: data.email_addresses[0].email_address,
        imageUrl: data.image_url,
      });
      break;
    }

    case "user.updated": {
      await UserModel.findByIdAndUpdate(data.id, {
        name: `${data.first_name} ${data.last_name}`,
        email: data.email_addresses[0].email_address,
        imageUrl: data.image_url,
      });
      break;
    }

    case "user.deleted": {
      await UserModel.findByIdAndDelete(data.id);
      break;
    }
  }

  res.json({ success: true });
});

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = catchError(async (request, response, next) => {
  let event;
  const signature = request.headers["stripe-signature"];

  try {
    event = Stripe.webhooks.constructEvent(
      request.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return response.sendStatus(400);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { purchaseId } = session.data[0].metadata;

      const purchaseData = await PurchaseModel.findById(purchaseId);
      const userData = await UserModel.findById(purchaseData.userId);
      const courseData = await CourseModel.findById(
        purchaseData.courseId.toString(),
      );

      courseData.enrolledStudents.push(userData);
      await courseData.save();

      userData.enrolledCourses.push(courseData._id);
      await userData.save();

      purchaseData.status = "completed";
      await purchaseData.save();

      break;
    }
    case "payment_method.attached": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      console.log(paymentIntent);

      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { purchaseId } = session.data[0].metadata;
      const purchaseData = await PurchaseModel.findById(purchaseId);

      purchaseData.status = "failed";
      await purchaseData.save();
      break;
    }
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.json({ received: true });
});
