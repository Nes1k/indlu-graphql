import mongoose, { Schema } from 'mongoose';
const { ObjectId } = Schema.Types;


const advertisementSchema = {
  estate: { type: ObjectId, ref: 'Estate' },
  payment: { type: Number, default: 0, min: 0, max: 1},
  price: { type: Number, required: true },
  freePlaces: Number,
  image: String
};

export default mongoose.model('Advertisement', advertisementSchema);
