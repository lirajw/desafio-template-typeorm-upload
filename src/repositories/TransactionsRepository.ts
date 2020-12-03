/* eslint-disable no-param-reassign */
import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {

    const transactions = await this.find();

    const { income, outcome } = transactions.reduce(
      (acumulator, currentTransaction: Transaction) => {
        switch (currentTransaction.type) {
          case 'income':
            acumulator.income += Number(currentTransaction.value);
            break;
          case 'outcome':
            acumulator.outcome += Number(currentTransaction.value);
            break;
          default:
            break;
        }

        return acumulator;
      },
      {
        income: 0,
        outcome: 0,
      },
    );

    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }
}

export default TransactionsRepository;
