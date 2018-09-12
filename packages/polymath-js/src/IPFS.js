// import ipfsAPI from 'ipfs-api'
import bs58 from 'bs58';

class IPFS {
  constructor() {
    // this._ipfs = ipfsAPI({ host: 'ipfs.infura.io', protocol: 'https' })
  }

  async put(data: Object, bytes32: boolean = true): Promise<string> {
    // noinspection JSUnresolvedVariable
    // const node = await this._ipfs.object.put({
    //   Data: JSON.stringify(data),
    //   Links: []
    // })
    // const hash = node.toJSON().multihash
    let id = localStorage.getItem('ipfsCount') || 11;
    if (id >= 100) {
      id = 11;
    }
    localStorage.setItem('ipfsCount', id + 1);
    const hash = `QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz${id}ojWnPbdG`;
    localStorage.setItem(hash, JSON.stringify(data));
    return bytes32 ? this.fromIPFSHash(hash) : hash;
  }

  async get(hash: string): Promise<Object> {
    if (hash.substring(0, 2) === '0x') {
      hash = this.toIPFSHash(hash);
    }
    try {
      // noinspection JSUnresolvedVariable
      // return JSON.parse(await this._ipfs.object.data(hash))
      return JSON.parse(localStorage.getItem(hash));
    } catch (e) {
      // eslint-disable-next-line
      console.error('IPFS get', e);
      return {};
    }
  }

  fromIPFSHash(hash: string): string {
    const bytes = bs58.decode(hash).slice(2);
    return (
      '0x' +
      Array.prototype.map
        .call(bytes, x => ('00' + x.toString(16)).slice(-2))
        .join('')
    );
  }

  toIPFSHash(hash: string): string {
    const remove0x = hash.slice(2);
    const bytes = Buffer.from(`1220${remove0x}`, 'hex');
    return bs58.encode(bytes);
  }
}

export default new IPFS();
