import { Schema, model, models, Document } from "mongoose";

const OID = Schema.Types.ObjectId;
const string = { type: String };
const stringUnique = { type: String, required: true, unique: true };
const dateNow = { type: Date, default: Date.now };

export interface IOrder extends Document {
  createdAt: Date;
  stripeId: string;
  totalAmount: string;
  event: { _id: string; title: string };
  buyer: { _id: string; firstName: string; lastName: string };
}

export type IOrderItem = {
  _id: string;
  totalAmount: string;
  createdAt: Date;
  eventTitle: string;
  eventId: string;
  buyer: string;
};

const OrderSchema = new Schema({
  createdAt: dateNow,
  stripeId: stringUnique,
  totalAmount: string,
  event: { type: OID, ref: "Event" },
  buyer: { type: OID, ref: "User" },
});

const Order = models.Order || model("Order", OrderSchema);

export default Order;
