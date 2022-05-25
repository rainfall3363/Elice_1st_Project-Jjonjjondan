import { productModel } from '../db';

class ProductService {
  // 본 파일의 맨 아래에서, new ProductService(productModel) 하면, 이 함수의 인자로 전달됨
  constructor(productModel) {
    this.productModel = productModel;
  }

  // 상품 등록
  async addProduct(productInfo) {
    const { title, price, description, maker, category } = productInfo;

    // 상품명 중복 확인
    const product = await this.productModel.findByTitle(title);
    if (product) {
      throw new Error('이미 등록된 상품명입니다.');
    }

    // 상품명 중복은 이제 아니므로, 상품등록을 진행함

    // db에 저장
    const createdNewProduct = await this.productModel.create(newProductInfo);

    return createdNewProduct;
  }

  // 전체 상품 목록을 받음.
  async getProduct() {
    const products = await this.productModel.findAll();
    return products;
  }

  // 상품 상세정보 불러오기
  async getProductInfo(productId) {
    const product = await this.productModel.findByProductId(productId);
    const { title, price, description, maker, category } = product;

    return { title, price, description, maker, category };
  }

  // 상품정보 수정
  async setProduct(productId, toUpdate) {
    // 우선 해당 id의 상품이 db에 있는지 확인
    let product = await this.productModel.findByProductId(productId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!product) {
      throw new Error('존재하지 않는 상품입니다.');
    }

    // 업데이트 진행
    product = await this.productModel.update({
      productId,
      update: toUpdate,
    });

    return product;
  }
}

const productService = new ProductService(productModel);

export { productService };
