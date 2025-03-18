import mongoose, {  Schema } from "mongoose"

export interface ICustomer extends Document {
    name: string
    address: string
    mobile: number
}

const customerSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  mobile: { type: Number, required: true },
  createdBy:{type: Schema.Types.ObjectId, ref: 'User', required: true}
});

export default mongoose.model<ICustomer>("Customer", customerSchema)