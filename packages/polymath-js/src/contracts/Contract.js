// @flow
import BigNumber from 'bignumber.js';
import { LOCAL_NETWORK_ID } from '@polymathnetwork/shared/constants';
import { LATEST_PROTOCOL_VERSION } from '../constants';

import type {
  NetworkParams,
  Artifact,
  Web3Contract,
  Web3Event,
  Address,
  Web3Receipt,
} from '../types';

export default class Contract {
  static _params: NetworkParams;
  static _registryAddressesSet: boolean;
  _artifact: Artifact;
  _artifactTestnet: ?Artifact;
  _contract: Web3Contract;
  _contractWS: Web3Contract;
  _methods: Object;
  address: Address;
  version: string = LATEST_PROTOCOL_VERSION;

  constructor(artifact: Artifact, at?: Address, artifactTestnet?: Artifact) {
    this._artifact = artifact;
    this._artifactTestnet = artifactTestnet;

    if (at) {
      this.setAddress(at);
    } else if (Contract._registryAddressesSet) {
      throw new Error(
        'Contracts instantiated after setup must specify an address'
      );
    }

    return new Proxy(this, {
      get: (target: Object, field: string): Promise<Web3Receipt> | any => {
        if (!Contract._registryAddressesSet && field === '_tx') {
          throw new Error(
            'Registry addresses not set. Did you forget to call "setupContracts"?'
          );
        }

        if (!Contract._params && field !== 'setParams') {
          throw new Error(
            'Network params not set. Did you forget to call "Contract.setParams"?'
          );
        }

        if (Contract._params && field === 'setParams') {
          throw new Error(
            'Cannot change network params after they have been set'
          );
        }

        if (target && target[field]) {
          return target[field];
        }

        const contract = target._contract;

        if (!contract) {
          return undefined;
        }

        const method = contract.methods[field];
        if (!method) {
          return method;
        }
        if (this._isView(field)) {
          return (...args) => method(...args).call();
        }
        return (...args) => this._tx(method(...args));
      },
    });
  }

  static setParams(params: NetworkParams) {
    Contract._params = params;
  }

  static isMainnet(): boolean {
    return Number(Contract._params.id) === 1;
  }

  static isLocalhost(): boolean {
    return Contract._params.id === LOCAL_NETWORK_ID;
  }

  get account(): Address {
    return Contract._params.account;
  }

  /** @private */
  _newContract(isWebSockets: boolean = false) {
    return new (isWebSockets
      ? Contract._params.web3WS
      : Contract._params.web3
    ).eth.Contract(this._artifact.abi, this.address);
  }

  /**
   * Sets address and instantiates web3 contract
   *
   * @param {Address} address address of the contract
   */
  setAddress(at: Address) {
    if (!Contract.isMainnet() && this._artifactTestnet) {
      this._artifact = this._artifactTestnet;
    }

    if (this._contract) {
      return;
    }
    this.address = at;
    this._contract = this._newContract();
    this._contractWS =
      Contract._params.web3WS === Contract._params.web3
        ? this._contract
        : this._newContract(true);
    // noinspection JSUnresolvedVariable
    this._methods = this._contract.methods;
  }

  /**
   * Checks whether a contract function is constant (view) or not.
   * @param name
   * @returns {boolean}
   * @private
   */
  _isView(name: string): boolean {
    for (let i = 0; i < this._artifact.abi.length; i++) {
      const method = this._artifact.abi[i];
      if (method.name === name) {
        // noinspection JSUnresolvedVariable
        return method.stateMutability === 'view';
      }
    }
    return false;
  }

  /**
   * Checks whether a contract function has boolean output or not.
   * @param name
   * @returns {boolean}
   * @private
   */
  _isBoolOutput(name: string): boolean {
    for (let i = 0; i < this._artifact.abi.length; i++) {
      const method = this._artifact.abi[i];
      if (method.name === name) {
        if (!method.outputs.length) {
          return false;
        }
        return (
          method.outputs[0].name === '' && method.outputs[0].type === 'bool'
        );
      }
    }
    throw new Error(`_isBoolOutput: no method with name "${name}" found`);
  }

  /**
   * @param method
   * @param value ETH
   * @param gasLimit gas limit multiplier or exact amount of gas
   * @returns {Promise.<Web3Receipt>}
   * @protected
   */
  async _tx(
    method: Object,
    value?: BigNumber,
    gasLimit?: number = 1.8,
    fixedGasPriceInGwei?: number
  ): Promise<Web3Receipt> {
    const preParams = {
      from: this.account,
      value: value
        ? this._toWei(new BigNumber(value).round(18).toString(10))
        : undefined,
    };

    let gas;
    if (gasLimit && gasLimit > 10) {
      gas = gasLimit;
    } else {
      const block = await Contract._params.web3WS.eth.getBlock('latest');
      const networkGasLimit = block.gasLimit;
      gas = Math.ceil(
        (await method.estimateGas(preParams)) * (gasLimit || 1.8)
      );

      if (gas > networkGasLimit) {
        gas = networkGasLimit;
      }
    }

    const gasPrice = fixedGasPriceInGwei
      ? this._toWei(
          new BigNumber(fixedGasPriceInGwei).round(18).toString(10),
          'gwei'
        ).toString(10)
      : await Contract._params.web3.eth.getGasPrice();
    const params = {
      ...preParams,
      gas,
      gasPrice,
    };

    // @TODO remon-nashid commented out to get around some false-negatives.
    /**
    // dry run
    try {
      const okCode = this._isBoolOutput(method._method.name);
      const dryResult = await method.call(params);
      if (okCode && dryResult !== okCode) {
        throw new Error(
          `Expected ${
            okCode === true ? 'true' : okCode
          }, but received ${dryResult}`
        );
      }
    } catch (e) {
      throw new Error(`Transaction dry run failed: ${e.message}`);
    }
     */

    let receipt;
    let txHash;

    const sleep = (n = 2500) => {
      return new Promise(resolve => setTimeout(resolve, n));
    };

    const end = async () => {
      /**
       * FIXME @monitz87: should check with the corresponding event for
       * each transaction instead of sleeping an arbitrary amount of time.
       * This is prone to cause race conditions and is a terrible coding practice.
       *
       * This function wasn't awaiting for the sleep to end when connected to a
       * local blockchain, but that caused inconsistent state issues
       * (due to race conditions when the transaction had finished but hadn't been mined yet)
       * so I put the sleep back in for now.
       */

      while (receipt === undefined) {
        await sleep(1000);
      }
      Contract._params.txEndCallback(receipt);
      if (receipt.status === '0x0') {
        throw new Error('Transaction failed');
      }
      return receipt;
    };

    try {
      receipt = await method.send(params, (error, hash) => {
        if (!error) {
          txHash = hash;
          Contract._params.txHashCallback(hash);
        }
      });
    } catch (e) {
      if (e.message.includes('not mined within 50 blocks')) {
        return new Promise(resolve => {
          const handle = setInterval(async () => {
            try {
              receipt = await Contract._params.web3.eth.getTransactionReceipt(
                txHash
              );
            } catch (e) {
              // skip
            }
            if (receipt != null && receipt.blockNumber > 0) {
              clearInterval(handle);
              resolve(end());
            }
          }, 1000);
        });
      }
      if (e.message.includes('denied transaction signature')) {
        throw new Error('Transaction cancelled');
      } else {
        throw new Error('An error has occurred');
      }
    }

    return end();
  }

  async subscribe(
    eventName: string,
    filter: Object,
    callback: (event: Web3Event) => void
  ): Promise<boolean> {
    try {
      await this._contractWS.events[eventName]({ filter }, (error, event) => {
        if (error) {
          // eslint-disable-next-line
          console.error(`Event "${eventName}" subscription error`, error);
          return;
        }
        // eslint-disable-next-line
        console.log(`Emitted ${eventName} event`, event);
        callback(event);
      });
      return true;
    } catch (e) {
      // eslint-disable-next-line
      console.error(`Event "${eventName}" subscription failed`, e);
      return false;
    }
  }

  static unsubscribe(): boolean {
    try {
      Contract._params.web3WS.eth.clearSubscriptions();
    } catch (e) {
      // TODO @bshevchenko: throws error when no subscriptions and probably subscriptions are not tracked at all
    }
    return true;
  }

  /**
   * @param blockHashOrNumber
   * @return {Date}
   * @protected
   */
  async _getBlockDate(blockHashOrNumber: number | string): Promise<Date> {
    const block = await Contract._params.web3.eth.getBlock(blockHashOrNumber);
    return this._toDate(block.timestamp);
  }

  /**
   * @param v
   * @returns {string}
   * @protected
   */
  _toBytes(v: string): string {
    return Contract._params.web3.utils.asciiToHex(v);
  }

  /**
   * @param v
   * @returns {string}
   * @protected
   */
  _toAscii(v: string): string {
    return Contract._params.web3.utils.hexToAscii(v).replace(/\u0000/g, '');
  }

  /**
   * @param v
   * @returns {number}
   * @protected
   */
  _toUnixTS(v: Date): number {
    return Math.floor(v.getTime() / 1000);
  }

  /**
   * @param v
   * @returns {Date}
   * @protected
   */
  _toDate(v: number): Date {
    return new Date(v * 1000);
  }

  /**
   * For destructuring Solidity array outputs.
   * @param v
   * @returns {Array<any>}
   * @protected
   */
  _toArray(v: Object): Array<any> {
    const result: Array<any> = [];
    for (let key of Object.keys(v)) {
      result.push(v[key]);
    }
    return result;
  }

  /**
   * @param v
   * @param unit
   * @returns {BigNumber}
   * @protected
   */
  _toWei(v: BigNumber, unit: string = 'ether'): BigNumber {
    return new BigNumber(Contract._params.web3.utils.toWei(v, unit));
  }

  /**
   * @param v
   * @param unit
   * @returns {BigNumber}
   * @protected
   */
  _fromWei(v: BigNumber, unit: string = 'ether'): BigNumber {
    return new BigNumber(Contract._params.web3.utils.fromWei(v, unit));
  }

  /**
   * @param v
   * @returns {boolean}
   * @protected
   */
  _isEmptyAddress(v: Address | string): boolean {
    return v === '0x0000000000000000000000000000000000000000';
  }
}
