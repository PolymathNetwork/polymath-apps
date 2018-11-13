// @flow

import artifact from '@polymathnetwork/shared/fixtures/contracts/SecurityToken.json';
import moduleFactoryArtifact from '@polymathnetwork/shared/fixtures/contracts/ModuleFactory.json';
import BigNumber from 'bignumber.js';

import Contract from './Contract';
import PermissionManager from './PermissionManager';
import TransferManager from './TransferManager';
import PercentageTransferManager from './PercentageTransferManager';
import CountTransferManager from './CountTransferManager';
import ModuleRegistry from './ModuleRegistry';
import IModuleFactory from './IModuleFactory';
import PolyToken from './PolyToken';
import STO, { FUNDRAISE_ETH, FUNDRAISE_POLY } from './STO';
import type { Address, Web3Receipt, Investor } from '../types';

const MODULE_TYPES = {
  PERMISSION: 1,
  TRANSFER: 2,
  STO: 3,
  DIVIDENDS: 4,
};

const MINTED_EVENT = 'Minted';

export default class SecurityToken extends Contract {
  decimals: number = 18;

  owner: () => Promise<Address>;
  name: () => Promise<string>;
  tokenDetails: () => Promise<string>;
  transfersFrozen: () => Promise<boolean>;
  granularity: () => Promise<number | BigNumber>;

  setTokenBurner: (address: Address) => Promise<Web3Receipt>;
  freezeTransfers: () => Promise<Web3Receipt>;
  unfreezeTransfers: () => Promise<Web3Receipt>;
  updateTokenDetails: (newTokenDetails: string) => Promise<Web3Receipt>;

  constructor(at: Address) {
    super(artifact, at);
  }

  async securityTokenVersion(): Promise<string> {
    return this._toAscii(await this._methods.securityTokenVersion().call());
  }

  addDecimals(n: number | BigNumber): Promise<BigNumber> {
    return new BigNumber(10).toPower(this.decimals).times(n);
  }

  removeDecimals(n: number | BigNumber): Promise<BigNumber> {
    return new BigNumber(n).div(new BigNumber(10).toPower(this.decimals));
  }

  async isDivisible(): Promise<boolean> {
    return Number(await this.granularity()) === 1;
  }

  async verifyTransfer(
    from: Address,
    to: Address,
    amount: BigNumber
  ): Promise<boolean> {
    return this._methods
      .verifyTransfer(
        from,
        to,
        this.addDecimals(amount),
        Contract._params.web3.utils.fromAscii('')
      )
      .call();
  }

  async mint(investor: Address, amount: BigNumber): Promise<Web3Receipt> {
    return this._tx(this._methods.mint(investor, this.addDecimals(amount)));
  }

  async burn(amount: BigNumber): Promise<Web3Receipt> {
    return this._tx(this._methods.burn(this.addDecimals(amount)));
  }

  async getModuleByName(name: string): Promise<Address> {
    const address = (await this._methods
      .getModulesByName(this._toBytes(name))
      .call())[0];
    if (this._isEmptyAddress(address)) {
      throw new Error(`Module ${name} not found`);
    }
    return address;
  }

  async getPermissionManager(): Promise<?PermissionManager> {
    try {
      const address = await this.getModuleByName('GeneralPermissionManager');
      return new PermissionManager(address);
    } catch (e) {
      return null;
    }
  }

  async getTransferManager(): Promise<?TransferManager> {
    try {
      const address = await this.getModuleByName('GeneralTransferManager');
      return new TransferManager(address);
    } catch (e) {
      return null;
    }
  }

  async getPercentageTM(): Promise<?PercentageTransferManager> {
    try {
      const address = await this.getModuleByName('PercentageTransferManager');
      return new PercentageTransferManager(address);
    } catch (e) {
      return null;
    }
  }

  async getCountTM(): Promise<?CountTransferManager> {
    try {
      const address = await this.getModuleByName('CountTransferManager');
      return new CountTransferManager(address);
    } catch (e) {
      return null;
    }
  }

  async getSTO(): Promise<?STO> {
    try {
      const address = await this.getModuleByName('CappedSTO');
      return new STO(address, this);
    } catch (e) {
      return null;
    }
  }

  async withdrawPoly(amount: BigNumber): Promise<Web3Receipt> {
    return this._tx(this._methods.withdrawPoly(PolyToken.addDecimals(amount)));
  }

  async transfer(to: Address, amount: BigNumber): Promise<Web3Receipt> {
    return this._tx(this._methods.transfer(to, this.addDecimals(amount)));
  }

  async transferFrom(
    from: Address,
    to: Address,
    amount: BigNumber
  ): Promise<Web3Receipt> {
    return this._tx(
      this._methods.transferFrom(from, to, this.addDecimals(amount))
    );
  }

  async mintMulti(
    addresses: Array<Address>,
    amounts: Array<number | BigNumber>
  ): Promise<Web3Receipt> {
    const amountsFinal = [];
    for (let amount of amounts) {
      amountsFinal.push(this.addDecimals(amount));
    }
    return this._tx(this._methods.mintMulti(addresses, amountsFinal));
  }

  async getMinted(): Promise<Array<Investor>> {
    // $FlowFixMe
    const tm = await this.getTransferManager();
    const investors = await tm.getWhitelist(true);

    const events = await this._contractWS.getPastEvents(MINTED_EVENT, {
      fromBlock: 0,
      toBlock: 'latest',
    });

    for (let event of events) {
      const amount = this.removeDecimals(event.returnValues._value);
      for (let i = 0; i < investors.length; i++) {
        if (event.returnValues._to === investors[i].address) {
          if (investors[i].minted) {
            investors[i].minted = investors[i].minted.plus(amount);
          } else {
            investors[i].minted = new BigNumber(amount);
          }
          break;
        }
      }
    }

    const result = [];
    for (let i = 0; i < investors.length; i++) {
      if (investors[i].minted) {
        result.push(investors[i]);
      }
    }

    return result;
  }

  async getModuleFactory(name: string, type: number) {
    let availableModules = await ModuleRegistry._methods
      .getModulesByTypeAndToken(type, this.address)
      .call();

    let result = null;

    if (!availableModules || !availableModules.length) {
      return result;
    }

    let counter = 0;

    while (result === null && counter < availableModules.length) {
      const moduleFactory = new IModuleFactory(
        moduleFactoryArtifact,
        availableModules[counter]
      );
      const hexName = await moduleFactory._methods.name().call();
      const currentName = Contract._params.web3.utils.hexToAscii(hexName);
      if (currentName.localeCompare(name) === 0) {
        result = moduleFactory;
        break;
      }
      counter++;
    }

    return result;
  }

  async setCappedSTO(
    start: Date,
    end: Date,
    cap: number,
    rate: number,
    isEth: boolean, // fundraise type, use true for ETH or false for POLY
    fundsReceiver: Address
  ): Promise<Web3Receipt> {
    const cappedSTOFactory = await this.getModuleFactory(
      'CappedSTO',
      MODULE_TYPES.STO
    );
    const setupCost = await cappedSTOFactory.setupCost();
    const balance = await PolyToken.balanceOf(this.address);
    //Skip transfer transaction if setupCost already paid
    if (balance < setupCost) {
      await PolyToken.transfer(this.address, setupCost);
    }
    const data = Contract._params.web3.eth.abi.encodeFunctionCall(
      {
        name: 'configure',
        type: 'function',
        inputs: [
          {
            type: 'uint256',
            name: '_startTime',
          },
          {
            type: 'uint256',
            name: '_endTime',
          },
          {
            type: 'uint256',
            name: '_cap',
          },
          {
            type: 'uint256',
            name: '_rate',
          },
          {
            type: 'uint8[]',
            name: '_fundRaiseTypes',
          },
          {
            type: 'address',
            name: '_fundsReceiver',
          },
        ],
      },
      [
        this._toUnixTS(start),
        this._toUnixTS(end),
        this._toWei(cap),
        rate,
        isEth ? [FUNDRAISE_ETH] : [FUNDRAISE_POLY],
        fundsReceiver,
      ]
    );
    return this._tx(
      this._methods.addModule(
        cappedSTOFactory.address,
        data,
        PolyToken.addDecimals(setupCost),
        0
      ),
      null,
      1.05
    );
  }

  async setUSDTieredSTO(): Promise<Web3Receipt> {
    const cappedSTOFactory = await this.getModuleFactory(
      'CappedSTO',
      MODULE_TYPES.STO
    );
    const setupCost = await cappedSTOFactory.setupCost();
    await PolyToken.transfer(this.address, setupCost);
    const data = Contract._params.web3.eth.abi.encodeFunctionCall(
      {
        name: 'configure',
        type: 'function',
        inputs: [
          {
            type: 'uint256',
            name: '_startTime',
          },
          {
            type: 'uint256',
            name: '_endTime',
          },
          {
            type: 'uint256',
            name: '_cap',
          },
          {
            type: 'uint256',
            name: '_rate',
          },
          {
            type: 'uint8[]',
            name: '_fundRaiseTypes',
          },
          {
            type: 'address',
            name: '_fundsReceiver',
          },
        ],
      },
      [
        this._toUnixTS(start),
        this._toUnixTS(end),
        this._toWei(cap),
        rate,
        isEth ? [FUNDRAISE_ETH] : [FUNDRAISE_POLY],
        fundsReceiver,
      ]
    );
    return this._tx(
      this._methods.addModule(
        cappedSTOFactory.address,
        data,
        PolyToken.addDecimals(setupCost),
        0
      ),
      null,
      1.05
    );
  }

  async setPercentageTM(percentage: number): Promise<Web3Receipt> {
    const percentageTransferManagerFactory = await this.getModuleFactory(
      'PercentageTransferManager',
      MODULE_TYPES.TRANSFER
    );
    const setupCost = await percentageTransferManagerFactory.setupCost();
    const data = Contract._params.web3.eth.abi.encodeFunctionCall(
      {
        name: 'configure',
        type: 'function',
        inputs: [
          {
            type: 'uint256',
            name: '_maxHolderPercentage',
          },
          {
            type: 'bool',
            name: '_allowPrimaryIssuance',
          },
        ],
      },
      [PercentageTransferManager.addDecimals(percentage), false]
    );
    return this._tx(
      this._methods.addModule(
        percentageTransferManagerFactory.address,
        data,
        PolyToken.addDecimals(setupCost),
        0
      )
    );
  }

  async setCountTM(count: number): Promise<Web3Receipt> {
    const countTransferManagerFactory = await this.getModuleFactory(
      'CountTransferManager',
      MODULE_TYPES.TRANSFER
    );
    const setupCost = await countTransferManagerFactory.setupCost();
    const data = Contract._params.web3.eth.abi.encodeFunctionCall(
      {
        name: 'configure',
        type: 'function',
        inputs: [
          {
            type: 'uint256',
            name: '_maxHolderCount',
          },
        ],
      },
      [count]
    );
    return this._tx(
      this._methods.addModule(
        countTransferManagerFactory.address,
        data,
        PolyToken.addDecimals(setupCost),
        0
      )
    );
  }
}
