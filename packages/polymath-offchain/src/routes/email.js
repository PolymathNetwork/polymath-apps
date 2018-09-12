import Router from 'koa-router';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Web3 from 'web3';
import fs from 'fs';

import crypto from 'crypto';
import User from '../models/User';
import EmailPIN from '../models/EmailPIN';
import Email from '../models/Email';
import sendEmail from '../email';
import { auth } from './auth';
import networks from '../networks';
import ConfirmEmail from '../emails/ConfirmEmail';
import styles from '../emails/styles';

const router = new Router();

router.post('/email/new', async ctx => {
  const { email, name, code, sig, address } = ctx.request.body;

  const error = await auth(code, sig, address);
  if (error) {
    ctx.body = error;
    return;
  }

  const pin = (await crypto.randomBytes(8)).toString('hex');
  await EmailPIN.create({ address, pin, email, isConfirmed: false });
  await User.update({ address }, { name }, { upsert: true });

  await sendEmail(
    email,
    name,
    'Confirm your account on Polymath',
    ReactDOMServer.renderToStaticMarkup(<ConfirmEmail pin={pin} />)
  );

  ctx.body = {
    status: 'ok',
    data: 'Confirmation email has been sent',
  };
});

router.post('/email/confirm', async ctx => {
  const { pin } = ctx.request.body;

  const minCreatedAt = new Date();
  minCreatedAt.setHours(minCreatedAt.getHours() - 24);

  const emailPin = await EmailPIN.findOneAndUpdate(
    {
      pin: String(pin).toLowerCase(),
      isConfirmed: false,
      createdAt: { $gte: minCreatedAt },
    },
    { isConfirmed: true }
  );
  if (!emailPin) {
    ctx.body = {
      status: 'error',
      data: 'Pin is not valid',
    };
    return;
  }

  await User.findOneAndUpdate(
    { address: emailPin.address },
    { email: emailPin.email }
  );

  ctx.body = {
    status: 'ok',
    data: 'Email has been confirmed',
  };
});

const readdirAsync = path => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

// eslint-disable-next-line complexity
router.post('/email', async ctx => {
  const {
    txHash,
    subject,
    body,
    coreVer,
    network,
    code,
    sig,
    address,
  } = ctx.request.body;

  const error = await auth(code, sig, address);
  if (error) {
    ctx.body = error;
    return;
  }

  const email = await Email.findOne({ txHash });
  if (email) {
    ctx.body = {
      status: 'error',
      data: 'Email for the provided txHash has been already sent before',
    };
    return;
  }

  const web3 = new Web3(networks[network]);
  const tx = await web3.eth.getTransaction(txHash);

  if (tx.from.toLowerCase() !== address.toLowerCase()) {
    ctx.body = {
      status: 'error',
      data: 'Invalid transaction from address',
    };
    return;
  }

  if (tx.blockNumber === null) {
    ctx.body = {
      status: 'error',
      data: 'Transaction is pending',
    };
    return;
  }

  let isToOk = false;
  let isCoreVerError = false;
  const dir = `./node_modules/polymath-core-v${coreVer}/build/contracts/`;
  const artifactFile = (name, ext = true) =>
    '../.' + dir + name + (ext ? '.json' : '');
  try {
    const files = await readdirAsync(dir);
    files.forEach(file => {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const artifact = require(artifactFile(file, false));

      let contractAddress;
      try {
        contractAddress = artifact.networks[network].address;
      } catch (e) {
        // empty
      }

      if (tx.to.toLowerCase() === String(contractAddress).toLowerCase()) {
        isToOk = true;
        // TODO @bshevchenko: break cycle
      }
    });
  } catch (e) {
    isCoreVerError = true;
  }

  if (isCoreVerError) {
    ctx.body = {
      status: 'error',
      data: 'Invalid or unsupported core version',
    };
    return;
  }

  const initContract = (name, address) => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const artifact = require(artifactFile(name));
    return new web3.eth.Contract(
      artifact.abi,
      address || artifact.networks[network].address
    );
  };

  if (!isToOk) {
    const stRegistry = initContract('SecurityTokenRegistry');
    let events = await stRegistry.getPastEvents('LogNewSecurityToken', {
      filter: { _securityTokenAddress: tx.to },
      fromBlock: 0,
      toBlock: 'latest',
    });

    if (!events.length) {
      try {
        const module = initContract('IModule', tx.to);
        const stAddress = await module.methods.securityToken().call();
        events = await stRegistry.getPastEvents('LogNewSecurityToken', {
          filter: { _securityTokenAddress: stAddress },
          fromBlock: 0,
          toBlock: 'latest',
        });
      } catch (e) {
        // empty
      }
    }

    if (!events.length) {
      const moduleRegistry = initContract('ModuleRegistry');
      events = await moduleRegistry.getPastEvents('LogModuleRegistered', {
        filter: { _moduleFactory: tx.to },
        fromBlock: 0,
        toBlock: 'latest',
      });
    }

    if (!events.length) {
      ctx.body = {
        status: 'error',
        data: 'Transaction does not belong to the Polymath Network',
      };
      return;
    }
  }

  const user = await User.findOne({ address });
  await sendEmail(
    user.email,
    user.name,
    subject,
    `<html><head><style>${styles}</style></head><body>${body}</body></html>`
  );

  await Email.create({ txHash });

  ctx.body = {
    status: 'ok',
    data: 'Email has been sent',
  };
});

export default router;
