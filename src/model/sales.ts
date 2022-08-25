import { Schema, model, Document } from 'mongoose';
import { formatDate } from '../utils';

const item = {
  name: String,
  tags: [String],
  price: Number,
  quantity: Number,
};

const salesSchema = new Schema<ISale>({
  _id: { type: Schema.Types.ObjectId },
  saleDate: { type: Schema.Types.Date },
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

const Sales = model<ISale>('sales', salesSchema);

type SaleBase = {
  items: {
    name: string;
    tags: string[];
    price: number;
    quantity: number;
  }[];
  storeLocation: string;
  customer: {
    gender: string;
    age: number;
    email: string;
    satisfaction: number;
  };
  couponUsed: boolean;
  purchaseMethod: string;
};

interface ISale extends SaleBase, Document {
  saleDate: Date;
}
interface ISaleVM extends SaleBase {
  saleDate: string;
}

class Sale implements ISaleVM {
  saleDate: string;
  items: {
    name: string;
    tags: string[];
    price: number;
    quantity: number;
  }[];
  storeLocation: string;
  customer: {
    gender: string;
    age: number;
    email: string;
    satisfaction: number;
  };
  couponUsed: boolean;
  purchaseMethod: string;
  constructor(d: ISale) {
    this.saleDate = formatDate(d.saleDate);
    this.items = d.items;
    this.storeLocation = d.storeLocation;
    this.customer = d.customer;
    this.couponUsed = d.couponUsed;
    this.purchaseMethod = d.purchaseMethod;
  }
}

const SalesFactory = (sales: ISale[]) => sales.map((s) => new Sale(s));

export { Sales, SalesFactory };
