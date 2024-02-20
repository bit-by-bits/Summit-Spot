import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";
import { clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const SECRET = process.env.WEBHOOK_SECRET;

  if (!SECRET) throw new Error("Secret is missing.");

  const PAYLOAD = headers();

  const SVIX_ID = PAYLOAD.get("svix-id");
  const SVIX_TIME = PAYLOAD.get("svix-timestamp");
  const SVIX_SIGN = PAYLOAD.get("svix-signature");

  if (!SVIX_ID || !SVIX_TIME || !SVIX_SIGN)
    return new Response("Error occured -- no svix headers", { status: 400 });

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let EVENT: WebhookEvent;
  const wh = new Webhook(SECRET);

  try {
    EVENT = wh.verify(body, {
      "svix-id": SVIX_ID,
      "svix-timestamp": SVIX_TIME,
      "svix-signature": SVIX_SIGN,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", { status: 400 });
  }

  const eventType = EVENT.type;

  if (eventType === "user.created") {
    const { id, email_addresses, image_url, first_name, last_name, username } =
      EVENT.data;

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
  } else if (eventType === "user.updated") {
    const { id, image_url, first_name, last_name, username } = EVENT.data;

    const user = {
      firstName: first_name,
      lastName: last_name,
      username: username!,
      photo: image_url,
    };

    const updatedUser = await updateUser(id, user);

    return NextResponse.json({ message: "OK", user: updatedUser });
  } else if (eventType === "user.deleted") {
    const { id } = EVENT.data;

    const deletedUser = await deleteUser(id!);

    return NextResponse.json({ message: "OK", user: deletedUser });
  }

  return new Response("", { status: 200 });
}
