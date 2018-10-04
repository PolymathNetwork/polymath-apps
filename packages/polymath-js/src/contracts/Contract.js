// @flow

import BigNumber from 'bignumber.js';

import type {
  NetworkParams,
  Artifact,
  Web3Contract,
  Web3Event,
  Address,
  Web3Receipt,
} from '../types';

// FIXME @RafaelVidaurre: This shouldn't be the right way to do it, but
// this has to be here for now
const HARDCODED_NETWORK_ID = 15;

export default class Contract {
  static _params: NetworkParams;
  _artifact: Artifact;
  _artifactTestnet: ?Artifact;
  _contract: Web3Contract;
  _contractWS: Web3Contract;
  _methods: Object;
  address: Address;

  constructor(artifact: Artifact, at?: Address, artifactTestnet?: Artifact) {
    this._artifact = artifact;
    this._artifactTestnet = artifactTestnet;
    return new Proxy(this, {
      get: (target: Object, field: string): Promise<Web3Receipt> | any => {
        target._init(at);
        if (target && target[field]) {
          return target[field];
        }

        const method = target._contract.methods[field];
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
    return Contract._params.id === HARDCODED_NETWORK_ID;
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

  /** @private */
  _init(at?: Address) {
    if (!Contract.isMainnet() && this._artifactTestnet) {
      this._artifact = this._artifactTestnet;
    }
    let address;
    try {
      // $FlowFixMe
      address = JSON.parse(localStorage.getItem('polymath.js'))[
        this._artifact.contractName
      ][Contract._params.id];
    } catch (e) {
      try {
        address = at || this._artifact.networks[Contract._params.id].address;
      } catch (e) {
        throw new Error(
          'Contract is not deployed to the network ' + Contract._params.id
        );
      }
    }
    if (this._contract && this.address === address) {
      return;
    }
    this.address = address;
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
    gasLimit?: number
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
      gas = Math.ceil((await method.estimateGas(preParams)) * (gasLimit || 1));
    }
    const params = {
      ...preParams,
      gas,
      gasPrice: 5000000000,
    };

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

    let receipt;
    let txHash;

    const sleep = () => {
      return new Promise(resolve => setTimeout(resolve, 2500));
    };

    const end = async () => {
      if (!Contract.isLocalhost()) {
        await sleep();
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
