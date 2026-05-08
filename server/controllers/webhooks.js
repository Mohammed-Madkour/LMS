import { Webhook } from "svix";
import { catchError } from "../utils/catchError.js";
import UserModel from "../models/User.js";

export const clerkWebhooks = catchError(async (req, res) => {
  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

  const payload = req.body.toString();

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
