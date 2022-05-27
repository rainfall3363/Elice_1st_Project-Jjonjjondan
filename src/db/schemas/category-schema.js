// 평가기준표 기반 작성
import { Schema } from 'mongoose';
// categoryId (1, 2, ...), categoryName: (남성의류, 여성의류, 남성잡화,...), imageUrl, description
const CategorySchema = new Schema(
  {
    categoryId: {
      type: String,
      required: true,
    },
    categoryName: {
      type: Number,
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
