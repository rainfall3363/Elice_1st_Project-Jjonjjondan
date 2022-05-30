// 평가기준표 기반 작성
import { Schema } from 'mongoose';
// 상품번호, 상품명, 가격, 설명, 제조사, 카테고리
const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    maker: {
      type: String,
      required: false,
    },
    categoryName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    inventory: {
      type: Number,
      required: true,
    },
  },
  {
    collection: 'products',
    timestamps: true,
  }
);

export { ProductSchema };
