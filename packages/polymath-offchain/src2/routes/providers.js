// @flow

import Router from 'koa-router';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Web3 from 'web3';
import { NODE_ENV, WEB3_NETWORK } from '../constants';

import { User, Provider } from '../models';
import { sendEmail, verifySignature } from '../utils';
import ProviderEmail from '../emails';
import artifact from '@polymathnetwork/shared/fixtures/contracts/TickerRegistry.json';

const router = new Router();

router.post('/providers/apply', async ctx => {
  const { code, sig, address, companyName, ids } = ctx.request.body;

  const error = await verifySignature(code, sig, address);
  if (error) {
    ctx.body = error;
    return;
  }

  const user = await User.findOne();

  try {
    const web3 = new Web3(WEB3_NETWORK.url);
    const tickerRegistry = new web3.eth.Contract(
      artifact.abi,
      artifact.networks[WEB3_NETWORK.id].address
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

  if (NODE_ENV === 'PRODUCTION') {
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
