import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";
import { clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const SECRET = process.env.NEXT_CLERK_WEBHOOK_SECRET;
    console.log("SECRET", SECRET);
    if (!SECRET) throw new Error("Secret is missing.");

    const PAYLOAD = headers(req);
    const SVIX_ID = PAYLOAD.get("svix-id");
    const SVIX_TIME = PAYLOAD.get("svix-timestamp");
    const SVIX_SIGN = PAYLOAD.get("svix-signature");

    console.log("SVIX_ID", SVIX_ID);
    console.log("SVIX_TIME", SVIX_TIME);
    console.log("SVIX_SIGN", SVIX_SIGN);
    if (!SVIX_ID || !SVIX_TIME || !SVIX_SIGN)
      return new Response("Error occurred -- no svix headers", { status: 400 });

    const REQ_PAYLOAD = await req.json();
    const BODY = JSON.stringify(REQ_PAYLOAD);

    let EVENT: WebhookEvent;
    const WHOOK = new Webhook(SECRET);

    EVENT = WHOOK.verify(BODY, {
      "svix-id": SVIX_ID,
      "svix-timestamp": SVIX_TIME,
      "svix-signature": SVIX_SIGN,
    }) as WebhookEvent;

    const eventType = EVENT.type;

    console.log("EVENT", EVENT);
    console.log("eventType", eventType);

    switch (eventType) {
      case "user.created": {
        const {
          id,
          email_addresses,
          image_url,
          first_name,
          last_name,
          username,
        } = EVENT.data;

        const user = {
          clerkId: id,
          email: email_addresses[0].email_address,
          username: username!,
          firstName: first_name,
          lastName: last_name,
          photo: image_url,
        };

        const newUser = await createUser(user);

        if (newUser)
          await clerkClient.users.updateUserMetadata(id, {
            publicMetadata: { userId: newUser._id },
          });

        return NextResponse.json({ message: "OK", user: newUser });
      }
      case "user.updated": {
        const { id, image_url, first_name, last_name, username } = EVENT.data;

        const user = {
          firstName: first_name,
          lastName: last_name,
          username: username!,
          photo: image_url,
        };

        const updatedUser = await updateUser(id, user);

        return NextResponse.json({ message: "OK", user: updatedUser });
      }
      case "user.deleted": {
        const { id } = EVENT.data;

        const deletedUser = await deleteUser(id!);

        return NextResponse.json({ message: "OK", user: deletedUser });
      }
      default:
        return new Response("", { status: 200 });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
