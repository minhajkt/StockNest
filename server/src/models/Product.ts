import mongoose, { Schema } from "mongoose"

export interface IProduct extends Document {
    name: string
    description: string
    quantity: number
    price: number
}

const productSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model<IProduct>("Product", productSchema)