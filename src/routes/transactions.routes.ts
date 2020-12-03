import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import uploadconfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

const transactionsRouter = Router();

const upload = multer(uploadconfig);

transactionsRouter.get('/', async (request, response) => {
  const repository = getCustomRepository(TransactionsRepository);
  const transactions = await repository.find({
    relations: ['category'],
  });

  const balance = await repository.getBalance();

  return response.json({
    transactions,
    balance,
  });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category }: Request = request.body;

  const create = new CreateTransactionService();
  const transaction = await create.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteService = new DeleteTransactionService();
  deleteService.execute(id);

  return response.json({ return: 'ok' });
});

// eslint-disable-next-line prettier/prettier
// eslint-disable-next-line prettier/prettier
transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
    const importCsv = new ImportTransactionsService();
    const transactions = await importCsv.execute(request.file.path);

    return response.json(transactions);
  },
);

export default transactionsRouter;
