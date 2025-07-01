import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  code: String,
  Description: String,
  um: String,
  price: Number,
  qty: Number,
  total: Number,
}, {
  timestamps: true,
});

const Item = mongoose.model('Item', itemSchema);

export default Item;