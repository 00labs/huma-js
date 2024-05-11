export enum Network {
  mainnet = 'mainnet',
  testnet = 'testnet',
  futurenet = 'futurenet'
}

export enum NetworkPassphrase {
  mainnet = 'Public Global Stellar Network ; September 2015',
  futurenet = 'Test SDF Future Network ; October 2022',
  testnet = 'Test SDF Network ; September 2015'
}

export enum PublicRpcUrl {
  mainnet = 'https://horizon.stellar.org',
  testnet = 'https://soroban-testnet.stellar.org',
  futurenet = 'https://rpc-futurenet.stellar.org'
}

export type PoolMetadata = {
  name: string;
  contracts: {
    humaConfig: string;
    pool: string;
    poolManager: string;
    poolCredit: string;
    seniorTranche: string;
    juniorTranche: string;
  };
};

export type NetworkMetadata = {
  network: Network;
  networkPassphrase: NetworkPassphrase;
  rpcUrl: PublicRpcUrl;
  pools: PoolMetadata[];
};

export const NetworkMetadatas: NetworkMetadata[] = [
  {
    network: Network.testnet,
    networkPassphrase: NetworkPassphrase.testnet,
    rpcUrl: PublicRpcUrl.testnet,
    pools: [
      {
        name: 'Arf',
        contracts: {
          humaConfig:
            'CBIKE7DJOL3JK7NDACY257ZQV2WCOINFMOVOB6OFRKHRPP2556YY3WPW',
          pool: 'CAC2UYACIEXQQL2UMEXG5CBG2F2574AW5IZA37K2H2XYKRDEXFAV5GTI',
          poolManager:
            'CB2LCFYSZGZECT2PJKSYOG2LDZ3PQXSHWDEMY6PL42FMZEHHQ6VV33EP',
          poolCredit:
            'CBLRPVB4NXFF2I5I4FRRHU72PX6PJVL5YIEQIIJWKK2SUGS6Q3P2HXPR',
          juniorTranche:
            'CA525T5NVARC4VHMBURM56O7EFMZ4PSMYCOTFTZPHAYQTVD2A35WFEPQ',
          seniorTranche:
            'CB7ZVQXG5D7PYEFS2Z65VLUO5M45XFEBFKHHKHUO4Z25O5KUII66MKKU'
        }
      }
    ]
  }
];
