import { v4 as uuid } from 'uuid';
import { getRepository, Repository } from 'typeorm';
import Category from '../models/Category';

class CreateCategoryService {
  repository: Repository<Category>;

  public async execute(title: string): Promise<Category> {
    const newCategory = this.repository.create({
      title,
    });

    const category = await this.repository.save(newCategory);

    return category;
  }

  constructor(repository: Repository<Category>) {
    if (repository) {
      this.repository = repository;
    } else {
      this.repository = getRepository(Category);
    }
  }
}

export default CreateCategoryService;
