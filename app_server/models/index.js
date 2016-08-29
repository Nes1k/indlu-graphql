import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/rent');
mongoose.Promise = global.Promise;


export { default as User } from './user.js';
export const { Estate, Room } = require('./estate.js').default;
export { default as Advertisement } from './advertisement.js';
