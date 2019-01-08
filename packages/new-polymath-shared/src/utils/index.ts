export const delay = async (amount: number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, amount);
  });
};

export const toEtherscanUrl = (
  value: string,
  { network, type = 'tx' }: { network?: string; type?: string } = {}
) => `https://${network ? network + '.' : ''}etherscan.io/${type}/${value}`;
