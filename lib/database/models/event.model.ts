import { Document, Schema, model, models } from "mongoose";

const OID = Schema.Types.ObjectId;
const string = { type: String };
const stringRequired = { type: String, required: true };
const dateNow = { type: Date, default: Date.now };
const boolFalse = { type: Boolean, default: false };

export interface IEvent extends Document {
  _id: string;
  title: string;
  description?: string;
  location?: string;
  createdAt: Date;
  imageUrl: string;
  startDateTime: Date;
  endDateTime: Date;
  price: string;
  isFree: boolean;
  url?: string;
  category: { _id: string; name: string };
  organizer: { _id: string; firstName: string; lastName: string };
}

const EventSchema = new Schema({
  title: stringRequired,
  description: string,
  location: string,
  createdAt: dateNow,
  imageUrl: stringRequired,
  startDateTime: dateNow,
  endDateTime: dateNow,
  price: string,
  isFree: boolFalse,
  url: string,
  category: { type: OID, ref: "Category" },
  organizer: { type: OID, ref: "User" },
});

const Event = models.Event || model("Event", EventSchema);

export default Event;
