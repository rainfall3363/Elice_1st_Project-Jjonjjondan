import { model } from 'mongoose';
import { ProductSchema } from '../schemas/product-schema';

const Product = model('product', ProductSchema);

export class ProductModel {
  // 상품 상세
  async findByTitle(title) {
    const product = await Product.findOne({ title });
    return product;
  }
  // 상품 추가
  async create(productInfo) {
    const createdNewProduct = await Product.create(productInfo);
    return createdNewProduct;
  }
  // 상품 목록
  async findAll() {
    const products = await Product.find({});
    return products;
  }
  // 상품 수정, 카테고리 추가 및 수정
  async update({ productId, update }) {
    const filter = { _id: productId };
    const option = { returnOriginal: false };

    const updatedProduct = await User.findOneAndUpdate(filter, update, option);
    return updatedProduct;
  }
  // 상품 삭제
  async delete(productId) {
    const product = await Product.deleteOne({ _id: productId });
    return product;
  }
}

const productModel = new ProductModel();

export { productModel };
