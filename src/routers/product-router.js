import { Router } from 'express';
import is from '@sindresorhus/is';
import { productService } from '../services';

const productRouter = Router();

// 상품등록 api (아래는 /register이지만, 실제로는 /api/register로 요청해야 함.)
productRouter.post('/register', async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
      );
    }

    // req (request)의 body 에서 데이터 가져오기
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const maker = req.body.maker;
    const categoryName = req.body.categoryName;
    const image = req.body.image;
    const inventory = req.body.inventory;

    // 위 데이터를 상품 db에 추가하기
    const newProduct = await productService.addProduct({
      title,
      price,
      description,
      maker,
      categoryName,
      image,
      inventory,
    });

    // 추가된 상품의 db 데이터를 프론트에 다시 보내줌
    // 물론 프론트에서 안 쓸 수도 있지만, 편의상 일단 보내 줌
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// 전체 상품 목록을 가져옴 (배열 형태임)
productRouter.get('/list', async function (req, res, next) {
  try {
    // 전체 상품 목록을 얻음
    const products = await productService.getProducts();
    // 상품 목록(배열)을 JSON 형태로 프론트에 보냄
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// 특정 상품 정보 불러오기
productRouter.get('/info/:productId', async function (req, res, next) {
  try {
    const productInfo = await productService.getProductInfo(
      req.params.productId
    );

    res.status(200).json(productInfo);
  } catch (error) {
    next(error);
  }
});

productRouter.get('/search', async function (req, res, next) {
  try {
    const searchWord = req.query.searchWord;
    const products = await productService.getProducts();
    let resultArr = [];

    for (let i = 0; i < products.length; i++) {
      if (products[i].title.includes(searchWord)) {
        resultArr.push(products[i]);
      }
    }

    res.status(200).json(resultArr);
  } catch (error) {
    next(error);
  }
});

// 상품 정보 수정
// (예를 들어 /api/products/abc12345 로 요청하면 req.params.productId는 'abc12345' 문자열로 됨)
productRouter.patch('/update/:productId', async function (req, res, next) {
  try {
    // content-type 을 application/json 로 프론트에서
    // 설정 안 하고 요청하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        'headers의 Content-Type을 application/json으로 설정해주세요'
      );
    }
    const productId = req.params.productId;

    // body data 로부터 업데이트할 상품 정보를 추출함.
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const maker = req.body.maker;
    const categoryName = req.body.categoryName;
    const image = req.body.image;
    const inventory = req.body.inventory;

    // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
    // 보내주었다면, 업데이트용 객체에 삽입함.
    const toUpdate = {
      ...(title && { title }),
      ...(price && { price }),
      ...(description && { description }),
      ...(maker && { maker }),
      ...(categoryName && { categoryName }),
      ...(image && { image }),
      ...(inventory && { inventory }),
    };

    // 상품 정보를 업데이트함.
    const updatedProductInfo = await productService.setProduct(
      productId,
      toUpdate
    );

    // 업데이트 이후의 상품 데이터를 프론트에 보내 줌
    res.status(200).json(updatedProductInfo);
  } catch (error) {
    next(error);
  }
});

// 상품 정보 삭제
productRouter.delete('/delete/:productId', async function (req, res, next) {
  try {
    const productId = req.params.productId;
    const deletedProductInfo = await productService.deleteProduct(productId);

    res.status(200).json(deletedProductInfo);
  } catch (error) {
    next(error);
  }
});

export { productRouter };
