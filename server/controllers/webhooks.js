import { Webhook } from "svix";
import { catchError } from "../utils/catchError.js";
import UserModel from "../models/User.js";

export const clerkWebhooks = catchError(async (req, res, next) => {
  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

  await webhook.verify(JSON.stringify(req.body), {
    "svix-id": req.headers["svix-id"],
    "svix-timestamp": req.headers["svix-timestamp"],
    "svix-signature": req.headers["svix-signature"],
  });

  const { data, type } = req.body;

  switch (type) {
    case "user.created": {
      const userData = {
        _id: data.id,
        name: data.first_name + " " + data.last_name,
        email: data.email_addresses[0].email_address,
        imageUrl: data.image_url,
      };

      await UserModel.create(userData);
      res.json({});
      break;
    }

    case "user.updated": {
      const userData = {
        name: data.first_name + " " + data.last_name,
        email: data.email_addresses[0].email_address,
        imageUrl: data.image_url,
      };
      await UserModel.findByIdAndUpdate(data.id, userData);
      res.json({});
      break;
    }

    case "user.deleted": {
      await UserModel.findByIdAndDelete(data.id);
      res.json({});
      break;
    }

    default:
      break;
  }
});
