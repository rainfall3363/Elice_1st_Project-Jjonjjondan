# 쫀쫀단

헬스 관련제품들을 조회하고, 장바구니에 추가하고, 또 주문을 할 수 있는 쇼핑몰 프로젝트입니다. <br />
쫀쫀단이라는 이름은 쫀득쫀득 단백질의 약자입니다.

### https://docs.google.com/presentation/d/1rg6Lc1mpnJH5TWTJ-7YoLQj_h1RY6MqsfxluHdG_W1I/edit?usp=sharing

<br>

## 핵심 기능
1. 회원가입, 로그인, 회원정보 수정 등 **유저 정보 관련 CRUD** 
2. **제품 목록**을 조회 및, **제품 상세 정보**를 조회 가능함. 
3. 장바구니에 제품을 추가할 수 있으며, **장바구니에서 CRUD** 작업이 가능함.
4. 장바구니는 서버 DB가 아닌, 프론트 단에서 저장 및 관리됨 (localStorage, indexedDB 등)
5. 장바구니에서 주문을 진행하며, **주문 완료 후 조회 및 삭제**가 가능함.

## 주요 사용 기술

### 1. 프론트엔드

- **Vanilla javascript**, html, css (**Bulma css**)
- Font-awesome 
- Daum 도로명 주소 api 
- 이외

### 2. 백엔드 

- **Express** (nodemon, babel-node로 실행됩니다.)
- Mongodb, Mongoose
- cors
- 이외

<br>

## 폴더 구조
- 프론트: `src/views` 폴더 
- 백: src/views 이외 폴더 전체
- 실행: **프론트, 백 동시에, express로 실행**

<br>

## 구성원 역할

|  이름  |  역할  |  구현 기능  | 
| ------ | ------ | ------ |
| 강승훈 | 프론트엔드 | 홈 , 상품 카테고리, 상세 페이지 |
| 김재민 | 프론트엔드 | 장바구니, 주문정보, 결제완료 페이지  |
| 박노준 | 프론트엔드 | 로그인, 회원가입 / 유저 정보 출력, 정보 수정, 배송조회, 탈퇴 / 관리자 페이지 출력, 주문 상태 관리, 취소, 상품 CRUD, 카테고리 CRUD  |
| 김종한 |  백엔드  | 상품, 카테고리 API |
| 추효진 |  백엔드  | 유저, 주문 API - 단일 유저 조회, 유저 탈퇴 / 회원 비회원 판별 미들웨어 / 주문 입력, 조회, 수정, 삭제 / 주문 시 상품 재고 연동 / 관리자 권한 설정  |

---

본 프로젝트에서 제공하는 모든 코드 등의는 저작권법에 의해 보호받는 ㈜엘리스의 자산이며, 무단 사용 및 도용, 복제 및 배포를 금합니다.
Copyright 2022 엘리스 Inc. All rights reserved.

