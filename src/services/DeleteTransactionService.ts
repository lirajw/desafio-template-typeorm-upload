import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    if (!id) throw new AppError('Id not found', 400);
    const repository = getCustomRepository(TransactionRepository);
    await repository.delete(id);
  }
}

export default DeleteTransactionService;
