import { Router } from 'express';
import is from '@sindresorhus/is';
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired, whoAmI } from '../middlewares';
import { orderService } from '../services';

const orderRouter = Router();

// 주문 생성 api
orderRouter.post('/register', whoAmI, async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
      );
    }

    // req (request)의 body에서 데이터 가져오기
    // id는 whoAmI를 통해 로그인 상태라면 현재 로그인되어 있는 id, 아니라면 guest가 입력됨
    const ordererUserId = req.currentUserId;
    const ordererFullName = req.body.ordererFullName;
    const ordererPhoneNumber = req.body.ordererPhoneNumber;
    const recipientFullName = req.body.recipientFullName;
    const recipientPhoneNumber = req.body.recipientPhoneNumber;
    // address는 객체 형태 (postalCode, address1, address2)
    const recipientAddress = req.body.recipientAddress;
    // orderList는 배열을 담고 있다
    const orderList = req.body.orderList;
    const orderRequest = req.body.orderRequest;
    const orderStatus = req.body.orderStatus;

    // 위 데이터를 유저 db에 추가하기
    const newOrder = await orderService.putOrder({
      ordererUserId,
      ordererFullName,
      ordererPhoneNumber,
      recipientFullName,
      recipientPhoneNumber,
      recipientAddress,
      orderList,
      orderRequest,
      orderStatus,
    });

    // 추가된 주문의 db 데이터를 프론트에 다시 반환
    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});

// 전체 주문 목록 (객체가 여러 개 들어있음)
// 관리자 권한 설정 필요
orderRouter.get('/list', async function (req, res, next) {
  try {
    // 전체 주문 목록을 얻음
    const orders = await orderService.getAllOrders();
    // 주문 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
});

// 유저 ID로 주문 조회
orderRouter.get('/info/userId', loginRequired, async function (req, res, next) {
  try {
    const orders = await orderService.getOrdersByUserId(req.currentUserId);

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
});

// 주문 번호로 주문 조회
orderRouter.get('/info/:orderId', async function (req, res, next) {
  try {
    const orders = await orderService.getOrdersByOrderId(req.params.orderId);

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
});

// 주문 상태 수정
orderRouter.patch('/update/:orderId', async function (req, res, next) {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
      );
    }

    // body data로부터 업데이트할 주문 정보를 추출함.
    const orderId = req.params.orderId;
    const orderStatus = req.body.status;

    if (!orderStatus) {
      throw new Error('입력한 상태 값이 없습니다. 다시 입력해주세요.');
    }

    const toUpdate = { order: { status: orderStatus } };

    // 주문 상태를 업데이트함.
    const updatedOrderStatus = await orderService.setOrderStatus(
      orderId,
      toUpdate
    );

    res.status(200).json(updatedOrderStatus);
  } catch (error) {
    next(error);
  }
});

// 주문 삭제
orderRouter.delete('/delete/:orderId', async function (req, res, next) {
  try {
    const canceledOrder = await orderService.cancelOrder(req.params.orderId);

    res.status(200).json(canceledOrder);
  } catch (error) {
    next(error);
  }
});

export { orderRouter };
