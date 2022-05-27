import { model } from 'mongoose';
import { OrderSchema } from '../schemas/order-schema';

const Order = model('order', OrderSchema);

export class OrderModel {
  // 주문을 DB에서 다루는 함수 구현
  // 주문 생성
  // 주문 수정 o
  // 주문 조회
  //  - 전체 주문 목록 o
  //  - 유저ID로 조회 o
  //  - 주문번호로 조회 o
  // 주문 취소

  async create(orderInfo) {
    // orderInfo - 담을 정보 굉장히 많음 체크 꼼꼼히
    const createdNewOrder = await Order.create(orderInfo);
    return createdNewOrder;
  }

  async update({ orderNum, status }) {
    // status ("주문 접수", "배송 중", "배송 완료")
    // 객체로 다른 정보는 그대로인 상태로, status만 변경된 상태로 받아와야 할 듯
    const filter = { _id: orderNum };
    const option = { returnOriginal: false };

    const updatedOrder = await Order.findOneAndUpdate(filter, status, option);
    return updatedOrder;
  }

  // 관리자 주문 관리용
  async findAll() {
    const orders = await Order.find({});
    return orders;
  }

  async findByUserId(userId) {
    const orders = await Order.findOne({ userId });
    // 한 유저에 여러 개의 주문이 존재할 수 있다
    // 여러 개의 주문이 있다면, 여러 개의 주문이 담긴 배열이 리턴 될 것
    // 하나의 주문만 있어도 하나의 요소가 담긴 배열이 리턴 되야함
    return orders;
  }

  async findByOrderNum(orderNum) {
    const orders = await Order.findOne({ _id: orderNum });
    // 여러 개의 주문일 수도 있음
    // one의 결과가 아마 배열
    return orders;
  }

  async delete(orderNum) {
    const orders = await Order.findOneAndDelete({ _id: orderNum });
    // 삭제한 주문의 주문 정보를 리턴 함
    return orders;
  }
}

const orderModel = new orderModel();

export { orderModel };
