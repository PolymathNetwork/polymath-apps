import Router from 'koa-router';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Web3 from 'web3';

import User from '../models/User';
import Provider from '../models/Provider';
import sendEmail from '../email';
import { auth } from './auth';
import networks from '../networks';
import ProviderEmail from '../emails/ProviderEmail';

const router = new Router();

router.post('/providers/apply', async ctx => {
  const {
    code,
    sig,
    address,
    network,
    coreVer,
    companyName,
    ids,
  } = ctx.request.body;

  const error = await auth(code, sig, address);
  if (error) {
    ctx.body = error;
    return;
  }

  const user = await User.findOne({ address });

  try {
    const web3 = new Web3(networks[network]); // eslint-disable-next-line global-require, import/no-dynamic-require
    const artifact = require(`../../node_modules/polymath-core-v${coreVer}/build/contracts/TickerRegistry.json`);
    const tickerRegistry = new web3.eth.Contract(
      artifact.abi,
      artifact.networks[network].address
    );
    const events = await tickerRegistry.getPastEvents('LogRegisterTicker', {
      filter: { _owner: address },
      fromBlock: 0,
      toBlock: 'latest',
    });
    if (!events.length) {
      // noinspection ExceptionCaughtLocallyJS
      throw new Error();
    }
  } catch (e) {
    ctx.body = {
      status: 'error',
      data: 'No ticker was reserved',
    };
    return;
  }

  if (Number(network) === 1) {
    for (let i = 0; i < ids.length; i++) {
      ids[i] = Number(ids[i]);
    }
    const providers = await Provider.find({ id: { $in: ids } });
    for (let provider of providers) {
      await sendEmail(
        provider.email,
        provider.name,
        `${companyName} is interested in your services`,
        ReactDOMServer.renderToStaticMarkup(
          <ProviderEmail
            issuerName={user.name}
            issuerEmail={user.email}
            providerName={provider.name}
            application={ctx.request.body}
          />
        ),
        {
          name: user.name,
          email: user.email,
        }
      );
    }
  } else {
    await sendEmail(
      user.email,
      user.name,
      `DEMO: ${companyName} is interested in your services`,
      ReactDOMServer.renderToStaticMarkup(
        <ProviderEmail
          issuerName={user.name}
          providerName={user.name}
          issuerEmail={user.email}
          application={ctx.request.body}
        />
      )
    );
  }

  ctx.body = {
    status: 'ok',
    data: 'Application has been sent',
  };
});

export default router;
