import { types } from '@polymathnetwork/new-shared';
import { SvgErc20 } from '~/images/icons/Erc20';

// TODO @grsmto: update with the actual text and make dynamic where necessary (i.e Approve <amount> POLY)

export const getTransactionQueueText = (
  transactionQueue: types.TransactionQueueEntity
) =>
  ({
    [types.ProcedureTypes.UnnamedProcedure]: {
      title: 'Enable the Unnamed Procedure',
      description: 'Enabling the Unnamed Procedure is great.',
    },
    [types.ProcedureTypes.EnableDividendModules]: {
      title: 'Enable the Ability to Distribute Dividends',
      description:
        'Enabling the distribution of dividends in ERC20 Tokens, including POLY and Stablecoins.',
    },
    [types.ProcedureTypes.Approve]: {
      title: 'Approve',
      description: 'Approve',
    },
    [types.ProcedureTypes.CreateCheckpoint]: {
      title: 'CreateCheckpoint',
      description: 'CreateCheckpoint',
    },
    [types.ProcedureTypes.CreateErc20DividendDistribution]: {
      title: 'CreateErc20DividendDistribution',
      description: 'CreateErc20DividendDistribution',
    },
    [types.ProcedureTypes.CreateEtherDividendDistribution]: {
      title: 'CreateEtherDividendDistribution',
      description: 'CreateEtherDividendDistribution',
    },
    [types.ProcedureTypes.CreateSecurityToken]: {
      title: 'CreateSecurityToken',
      description: 'CreateSecurityToken',
    },
    [types.ProcedureTypes.ReclaimFunds]: {
      title: 'ReclaimFunds',
      description: 'ReclaimFunds',
    },
    [types.ProcedureTypes.ReserveSecurityToken]: {
      title: 'ReserveSecurityToken',
      description: 'ReserveSecurityToken',
    },
    [types.ProcedureTypes.UnnamedProcedure]: {
      title: 'UnnamedProcedure',
      description: 'UnnamedProcedure',
    },
    [types.ProcedureTypes.WithdrawTaxes]: {
      title: 'WithdrawTaxes',
      description: 'WithdrawTaxes',
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
