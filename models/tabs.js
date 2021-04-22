import { model, Schema } from "mongoose";

const tabs = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  dataPoints: { type: Array, required: true },
  CreatedDate: { type: Date, default: Date.now },
  ModifiedDate: { type: Date },
});

export const Tabs = model("Tabs", tabs);
