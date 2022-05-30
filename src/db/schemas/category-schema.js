// 평가기준표 기반 작성
import { Schema } from 'mongoose';
// categoryId (1, 2, ...), categoryName: (남성의류, 여성의류, 남성잡화,...), imageUrl, description
const CategorySchema = new Schema(
  {
    categoryId: {
      type: String, // objectId로 들어갈 예정이라 string으로 설정
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    collection: 'categories',
    timestamps: true,
  }
);

export { CategorySchema };
