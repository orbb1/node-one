import mongoose from 'mongoose';

const item = {
  name: String,
  tags: [String],
  price: Number,
  quantity: Number,
};

const salesSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  saleDate: { type: mongoose.Schema.Types.Date },
  items: { type: [item] },
  storeLocation: String,
  customer: {
    gender: String,
    age: Number,
    email: String,
    satisfaction: Number,
  },
  couponUsed: Boolean,
  purchaseMethod: String,
});
// sample_supplies.sales
const Sales = mongoose.model('sales', salesSchema);

export { Sales };
