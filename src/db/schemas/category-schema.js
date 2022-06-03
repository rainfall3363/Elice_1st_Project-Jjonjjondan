import { Schema } from 'mongoose';
// categoryName: (남성의류, 여성의류, 남성잡화,...), imageUrl, description
const CategorySchema = new Schema(
  {
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
