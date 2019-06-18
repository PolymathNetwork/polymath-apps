import BigNumber from 'bignumber.js';
import { Polymath } from '../Polymath';
import { Entity } from './Entity';
import { unserialize } from '../utils';
import { StoModuleTypes, isStoModuleTypes } from '../types';
import { FundraiseTypes } from '../LowLevel/types';
import { Investment } from './Investment';

export interface UniqueIdentifiers {
  securityTokenId: string;
  stoType: StoModuleTypes;
  address: string;
}

function isUniqueIdentifiers(
  identifiers: any
): identifiers is UniqueIdentifiers {
  const { securityTokenId, stoType, address } = identifiers;

  return (
    typeof securityTokenId === 'string' &&
    typeof address === 'string' &&
    isStoModuleTypes(stoType)
  );
}

export interface Params extends UniqueIdentifiers {
  securityTokenSymbol: string;
  startTime: Date;
  endTime: Date;
  fundraiseTypes: FundraiseTypes[];
  raisedAmount: BigNumber;
  soldTokensAmount: BigNumber;
  investorAmount: BigNumber;
  investments: Investment[];
  paused: boolean;
  capReached: boolean;
}

export abstract class StoModule extends Entity {
  public abstract uid: string;

  public address: string;

  public securityTokenSymbol: string;

  public securityTokenId: string;

  public stoType: StoModuleTypes;

  public startTime: Date;

  public endTime: Date;

  public raisedAmount: BigNumber;

  public soldTokensAmount: BigNumber;

  public investorAmount: BigNumber;

  public investments: Investment[];

  public fundraiseTypes: FundraiseTypes[];

  public paused: boolean;

  public capReached: boolean;

  public static unserialize(serialized: string) {
    const unserialized = unserialize(serialized);

    if (!isUniqueIdentifiers(unserialized)) {
      throw new Error('Wrong STO module ID format.');
    }

    return unserialized;
  }

  constructor(params: Params, polyClient?: Polymath) {
    super(polyClient);

    const {
      address,
      securityTokenSymbol,
      securityTokenId,
      stoType,
      fundraiseTypes,
      startTime,
      endTime,
      raisedAmount,
      soldTokensAmount,
      investorAmount,
      investments,
      paused,
      capReached,
    } = params;

    this.address = address;
    this.securityTokenSymbol = securityTokenSymbol;
    this.securityTokenId = securityTokenId;
    this.stoType = stoType;
    this.startTime = startTime;
    this.endTime = endTime;
    this.raisedAmount = raisedAmount;
    this.soldTokensAmount = soldTokensAmount;
    this.investorAmount = investorAmount;
    this.investments = investments;
    this.fundraiseTypes = fundraiseTypes;
    this.paused = paused;
    this.capReached = capReached;
  }

  public toPojo() {
    const {
      uid,
      securityTokenId,
      securityTokenSymbol,
      fundraiseTypes,
      raisedAmount,
      soldTokensAmount,
      investorAmount,
      investments,
      startTime,
      endTime,
    } = this;

    return {
      uid,
      securityTokenId,
      securityTokenSymbol,
      fundraiseTypes,
      raisedAmount,
      soldTokensAmount,
      investorAmount,
      startTime,
      endTime,
      investments: investments.map(investment => investment.toPojo()),
    };
  }
}
