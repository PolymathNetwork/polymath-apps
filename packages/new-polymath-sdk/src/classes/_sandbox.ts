import { Polymath } from './Polymath';

(async () => {
  // Reserving a token

  const polyClient = new Polymath() as any;
  const wallet = await polyClient.currentWallet;
  const balance = await wallet.getBalance('POLY');
  const plan = await wallet.reserveSecurityToken();

  const hlt = plan.run();
})().catch(err => {
  throw err;
});
