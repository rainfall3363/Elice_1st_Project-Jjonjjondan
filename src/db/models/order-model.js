import { model } from 'mongoose';
import { OrderSchema } from '../schemas/order-schema';

const Order = model('order', OrderSchema);

export class OrderModel {
  async create(orderInfo) {
    // orderInfo - 담을 정보 굉장히 많음 체크 꼼꼼히
    const createdNewOrder = await Order.create(orderInfo);
    return createdNewOrder;
  }

  // 관리자 주문 관리용
  async findAll() {
    const orders = await Order.find({});
    return orders;
  }

  async findByUserId(userId) {
    const orders = await Order.find({ orderer: { userId: userId } });
    // 한 유저에 여러 개의 주문이 존재할 수 있다
    // 객체 담은 객체 리턴, 근데 배열은 아님
    return orders;
  }

  async findByOrderId(orderId) {
    const orders = await Order.findOne({ _id: orderId });
    // orders 안에서 꺼내서 가공해서 사용해야함
    return orders;
  }

  async update({ orderId, update }) {
    const filter = { _id: orderId };
    const option = { returnOriginal: false };

    const updatedOrder = await Order.findOneAndUpdate(filter, update, option);
    return updatedOrder;
  }

  async delete(orderId) {
    const orders = await Order.findOneAndDelete({ _id: orderId });
    // 삭제한 주문의 주문 정보를 리턴함
    return orders;
  }
}

const orderModel = new OrderModel();

export { orderModel };
