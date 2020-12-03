import { getRepository, getCustomRepository, Repository } from 'typeorm';
import AppError from '../errors/AppError';
import CreateCategoryService from './CreateCategoryService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  private async ExistCategory(
    categoryTitle: string,
    repository: Repository<Category>,
  ): Promise<boolean> {
    const category = await repository.findOne({
      where: { title: categoryTitle },
    });

    if (category) return true;

    return false;
  }

  private async GetCategoryId(categoryTitle: string): Promise<string> {
    const repositoryCategory = getRepository(Category);

    const existCategory = await this.ExistCategory(
      categoryTitle,
      repositoryCategory,
    );

    if (!existCategory) {
      const createCategory = new CreateCategoryService(repositoryCategory);
      const category = await createCategory.execute(categoryTitle);
      return category.id;
    }

    const searchCategory = await repositoryCategory.findOne({
      where: { title: categoryTitle },
    });
    return searchCategory?.id ?? '';
  }

  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const repositoryTransaction = getCustomRepository(TransactionsRepository);

    const { total } = await repositoryTransaction.getBalance();

    if (type === 'outcome' && total < value) {

      throw new AppError('Value outcome invalid');
    }

    const categoryId = await this.GetCategoryId(category);

    if (!categoryId) throw new AppError('Category Id not found', 401);

    const newTransaction = repositoryTransaction.create({
      category: { id: categoryId },
      title,
      type,
      value,
    });

    await repositoryTransaction.save(newTransaction);

    return newTransaction;
  }
}

export default CreateTransactionService;
