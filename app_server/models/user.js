import mongoose, { Schema } from 'mongoose';
import Crypto from 'crypto';
import jwt from 'jsonwebtoken';

const { ObjectId } = Schema.Types;

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  hash: String,
  salt: String,

  country: String,
  street: String,
  postalCode: String,
  city: String,
  phone: String,
  firstName: String,
  lastName: String,
  dataJoined: { type: Date, default: Date.now },

  estates: [ { type: ObjectId, ref: 'Estate'} ],
  favourites: [ { type: ObjectId, ref: 'Advertisement' } ]
});

userSchema.methods.setPassword = (password) => {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = (password) => {
  const hahs = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = () => {
  const expire = new Date();
  expire.setDate(expire.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expire.getTime() / 1000)
  }, process.env.JWT_SECRET);
};


export default mongoose.model('User', userSchema);
