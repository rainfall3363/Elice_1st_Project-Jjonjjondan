import { orderModel } from '../db';

// 주문 생성
// 주문 수정
// 주문 조회
//  - 전체 주문 목록
//  - 유저ID로 조회
//  - 주문번호로 조회
// 주문 취소

class OrderService {
  // 본 파일의 맨 아래에서, new OrderService(orderModel) 하면, 이 함수의 인자로 전달됨
  constructor(orderModel) {
    this.orderModel = orderModel;
  }

  // 주문 입력
  async putOrder(orderInfo) {
    // 받아올 정보가 몹시 많음
    // userId, fullName, phoneNumber / fullName, phoneNumber, address / orderList / request, orderStatus

    // 객체 destructuring
    const {
      ordererUserId,
      ordererFullName,
      ordererPhoneNumber,
      recipientFullName,
      recipientPhoneNumber,
      recipientAddress,
      orderList,
      request,
      orderStatus,
    } = orderInfo;

    const newOrderInfo = {
      ordererUserId,
      ordererFullName,
      ordererPhoneNumber,
      recipientFullName,
      recipientPhoneNumber,
      recipientAddress,
      orderList,
      request,
      orderStatus,
    };
    // db에 저장
    const createdNewOrder = await this.orderModel.create(newOrderInfo);

    return createdNewOrder;
  }

  // 전체 주문 목록을 받음.
  async getAllOrders() {
    // 모든 객체를 다 가져옴
    const orders = await this.orderModel.findAll();
    // 작동함..!
    // const tmp = orders.map((elem) => elem.order.orderList);
    return orders;
  }

  async getOrdersByUserId(userId) {
    const orders = await this.orderModel.findByUserId(userId);
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!orders) {
      throw new Error('해당 주문 정보가 없습니다. 유효한 ID가 아닙니다.');
    }

    return orders;
  }

  async getOrdersByOrderId(orderId) {
    const orders = await this.orderModel.findByOrderId(orderId);
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!orders) {
      throw new Error(
        '해당 주문 정보가 없습니다. 유효한 주문 번호가 아닙니다.'
      );
    }
    return orders;
  }

  async setOrderStatus(orderId, toUpdate) {
    let order = this.orderModel.findByOrderId(orderId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!order) {
      throw new Error('주문 내역이 없습니다. 주문 번호를 확인해 주세요.');
    }

    // 업데이트 진행
    order = await this.orderModel.update({
      orderId,
      update: toUpdate,
    });

    return order;
  }

  // 주문 취소
  async cancelOrder(orderId) {
    const order = await this.orderModel.findByOrderId(orderId);
    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!order) {
      throw new Error(
        '해당 주문 정보가 없습니다. 유효한 주문 정보가 아닙니다.'
      );
    }
    const canceledOrder = await this.orderModel.delete(orderId);

    return canceledOrder;
  }
}

const orderService = new OrderService(orderModel);

export { orderService };
