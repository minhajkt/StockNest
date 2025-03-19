import mongoose, {  Schema } from "mongoose"

export interface ISale extends Document {
    date: Date
    customer: string
    product: string
    quantity: number
    price: number
} 

const saleSchema: Schema = new Schema({
  date: {type: Date, required: true, default:new Date().toLocaleDateString()},
  customer: { type: String, required: true },
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  price:{type: Number, required: true},
  createdBy:{type: Schema.Types.ObjectId, ref: 'User', required: true}
});

export default mongoose.model<ISale>("Sale", saleSchema)