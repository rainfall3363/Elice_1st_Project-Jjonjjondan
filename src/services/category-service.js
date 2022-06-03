import { categoryModel } from '../db';

class CategoryService {
  // 본 파일의 맨 아래에서, new CategoryService(categoryModel) 하면, 이 함수의 인자로 전달됨
  constructor(categoryModel) {
    this.categoryModel = categoryModel;
  }

  // 카테고리 등록
  async addCategory(categoryInfo) {
    const { categoryName } = categoryInfo;
    // 카테고리 이름 중복 확인
    const category = await this.categoryModel.findByCategoryName(categoryName);
    if (category) {
      throw new Error('이미 등록된 카테고리입니다.');
    }

    // 카테고리 중복은 이제 아니므로, 카테고리 등록을 진행함

    // db에 저장
    const createdNewCategory = await this.categoryModel.create(categoryInfo);
    return createdNewCategory;
  }

  // 전체 카테고리 목록을 받음.
  async getCategories() {
    const categories = await this.categoryModel.findAll();
    return categories;
  }

  // 카테고리 상세정보 불러오기
  async getCategoryInfo(categoryId) {
    const category = await this.categoryModel.findByCategoryId(categoryId);
    const { categoryName, imageUrl, description } = category;

    return { categoryName, imageUrl, description };
  }

  // 카테고리 정보 수정
  async setCategory(categoryId, toUpdate) {
    // 우선 해당 id의 카테고리가 db에 있는지 확인
    let category = await this.categoryModel.findByCategoryId(categoryId);

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!category) {
      throw new Error('존재하지 않는 카테고리입니다.');
    }

    // 업데이트 진행
    category = await this.categoryModel.update({
      categoryId,
      update: toUpdate,
    });

    return category;
  }

  // 카테고리 삭제
  async deleteCategory(categoryId) {
    const category = await this.categoryModel.delete(categoryId);
    if (!category) {
      throw new Error('해당 카테고리 정보가 없습니다.');
    }
    return category;
  }
}

const categoryService = new CategoryService(categoryModel);

export { categoryService };
