import { Schema } from 'mongoose';

const OrderSchema = new Schema(
  {
    orderer: {
      userId: { type: String, default: 'Guest' },
      fullName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },
    recipient: {
      fullName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      address: {
        type: new Schema(
          {
            postalCode: { type: String, required: true },
            address1: { type: String, required: true },
            address2: String,
          },
          {
            _id: false,
          }
        ),
        required: true,
      },
    },
    order: {
      orderList: {
        type: [
          new Schema({
            productCode: { type: String, required: true },
            productName: { type: String, required: true },
            orderQuantity: { type: Number, required: true },
            price: { type: Number, required: true },
          }),
        ],
        required: true,
      },
    },
    request: { type: String, required: true },
    orderStatus: { type: String, required: true, default: '상품 준비 중' },
  },
  {
    collection: 'orders',
    timestamps: true,
  }
);

export { OrderSchema };
