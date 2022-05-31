import { model } from 'mongoose';
import { CategorySchema } from '../schemas/category-schema';

const Category = model('category', CategorySchema);

export class CategoryModel {
  // 카테고리 추가
  async create(categoryInfo) {
    const createdNewCategory = await Category.create(categoryInfo);
    return createdNewCategory;
  }
  // 전체 카테고리 조회
  async findAll() {
    const categories = await Category.find({});
    return categories;
  }
  // 특정 카테고리 조회
  async findByCategoryId(categoryId) {
    const category = await Category.findOne({ _id: categoryId });
    return category;
  }
  // 카테고리 수정
  async update({ categoryId, update }) {
    const filter = { _id: categoryId };
    const option = { returnOriginal: false };
    const updatedCategory = await User.findOneAndUpdate(filter, update, option);
    return updatedCategory;
  }
  // 카테고리 삭제
  async delete(categoryId) {
    const category = await Category.findOneAndDelete({ _id: categoryId });
    return category;
  }
}

const categoryModel = new CategoryModel();

export { categoryModel };
