import { types } from '@polymathnetwork/new-shared';
import { SvgErc20 } from '~/images/icons/Erc20';

export const getTransactionQueueText = (
  transactionQueue: types.TransactionQueueEntity
) =>
  ({
    [types.ProcedureTypes.EnableDividends]: {
      title: 'Enable the Ability to Distribute Dividends',
      description:
        'Enabling the distribution of dividends in ERC20 Tokens, including POLY and Stablecoins.',
    },
  }[transactionQueue.procedureType]);

export const getTransactionText = (transaction: types.TransactionEntity) =>
  ({
    [types.PolyTransactionTags.Any]: {
      title: 'A transaction title',
      description: 'A transaction description',
      Icon: SvgErc20,
    },
    [types.PolyTransactionTags.Approve]: {
      title: 'A transaction title',
      description: 'A transaction description',
      Icon: SvgErc20,
    },
    [types.PolyTransactionTags.GetTokens]: {
      title: 'A transaction title',
      description: 'A transaction description',
      Icon: SvgErc20,
    },
    [types.PolyTransactionTags.ReserveSecurityToken]: {
      title: 'A transaction title',
      description: 'A transaction description',
      Icon: SvgErc20,
    },
    [types.PolyTransactionTags.CreateSecurityToken]: {
      title: 'A transaction title',
      description: 'A transaction description',
      Icon: SvgErc20,
    },
    [types.PolyTransactionTags.CreateCheckpoint]: {
      title: 'A transaction title',
      description: 'A transaction description',
      Icon: SvgErc20,
    },
    [types.PolyTransactionTags.CreateErc20DividendDistribution]: {
      title: 'A transaction title',
      description: 'A transaction description',
      Icon: SvgErc20,
    },
    [types.PolyTransactionTags.CreateEtherDividendDistribution]: {
      title: 'A transaction title',
      description: 'A transaction description',
      Icon: SvgErc20,
    },
    [types.PolyTransactionTags.SetErc20TaxWithholding]: {
      title: 'A transaction title',
      description: 'A transaction description',
      Icon: SvgErc20,
    },
    [types.PolyTransactionTags.SetEtherTaxWithholding]: {
      title: 'A transaction title',
      description: 'A transaction description',
      Icon: SvgErc20,
    },
    [types.PolyTransactionTags.EnableDividends]: {
      title: 'A transaction title',
      description: 'A transaction description',
      Icon: SvgErc20,
    },
    [types.PolyTransactionTags.ReclaimDividendFunds]: {
      title: 'A transaction title',
      description: 'A transaction description',
      Icon: SvgErc20,
    },
    [types.PolyTransactionTags.WithdrawTaxWithholdings]: {
      title: 'A transaction title',
      description: 'A transaction description',
      Icon: SvgErc20,
    },
  }[transaction.tag]);
