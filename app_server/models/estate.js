import mongoose, { Schema } from 'mongoose';
const { ObjectId } = Schema.Types;

const roomSchema = new Schema({
  estate: { type: ObjectId, ref: 'estate' },
  roomsType: { type: Number, default: 0, min: 0, max: 5},
  name: { type: String, required: true },
  area: {type: Number, min: 0 },
  freePlaces: { type: Number, min: 0},
  equipment: [],
  images: [ String ]
});

const estateSchema = new Schema({
  user: { type: ObjectId, ref: 'User' },
  country: { type: String, required: true },
  street: { type: String, required: true },
  postalCode: { type: String, required: true},
  city: { type: String, required: true },
  buildingType: { type: Number, default: 0, min: 0, max: 5},
  name: { type: String, required: true },
  area: Number,
  totalPlaces: Number,
  coords: {
    type: [ Number ],
    index: '2dsphere'
  },
  rooms: [ roomSchema ],
  /* tenants: [ { type: ObjectId, ref: 'User'} ],*/
  advertisement: { type: ObjectId, ref: 'Advertisement' }
});

export default {
  Estate: mongoose.model('Estate', estateSchema),
  Room: mongoose.model('Room', roomSchema)
};
