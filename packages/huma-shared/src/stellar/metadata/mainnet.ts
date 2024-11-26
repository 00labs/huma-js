import { StellarChainEnum } from '../chain'
import { StellarPoolsInfo } from '../types/metadata'
import { POOL_NAME, POOL_TYPE } from '../../utils/pool'

export const STELLAR_MAINNET_METADATA: StellarPoolsInfo = {
  ArfCreditPoolV2: {
    title: 'Arf - Cross Border Payment Financing',
    poolName: POOL_NAME.ArfCreditPoolV2,
    poolType: POOL_TYPE.CreditLine,
    chainId: StellarChainEnum.StellarMainnet,
    industry: 'Remittance Financing',
    desc: 'Arf provides an innovative on-chain liquidity solution that simplifies cross-border payments by facilitating immediate USDC-based settlements and tokenizing payment orders, enhancing transparency in the process.',
    poolStorage: 'CBIJ2WP7TTSMINHJRUX52YR2T3YOD7T2X4335PW3DS4GIOOJ5JQT5WF2',
    pool: 'CAOYBU6OQWAF3OZBHW5N6ID7TPAKZBJ27XR63IGTXMWEI3NSNTCYI6SH',
    poolManager: 'CBQ7KII3OETETYM65TFJT2YPVFFK42V4WUBIMJJNWKTIZ5XOWYZW3XAO',
    poolCredit: 'CANCNGJEAAN4GS6WVI3OAFWD2IAJW6WMI7TOD4UHC623QTDMD3LVTN3G',
    creditManager: 'CD7FKCTK2Z3KX7RZEEKD632RIR7J65KALICV6G7W4UPRMF65RNXAT5AM',
    creditStorage: 'CB6W2Z5ZRKLUL5A3OIHD7IAYMFLNRJ2VHFEXG7TSBB4LFE3YYSJII5JG',
    juniorTranche: 'CCHQ5HEKNHCH3LUQ3B73VJRDHNSKOUL567VB3HMOJ7M7BI4QVZ7WCQCL',
    seniorTranche: 'CAEVE6BJIXQV54DGNFZ5GRIMIIITAHXSOWTGKTDZCQZA4FXK4ZNDZYFX',
    trancheDecimals: 6,
    underlyingToken: {
      address: 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
      symbol: 'USDC',
      decimals: 6,
      icon: 'USDC',
    },
    extra: {
      borrower: 'GBQ4MIGKASCJG4GNEOQ3G6Z6YDUXCAKYARB3MNJ7QOF54MNMYW7HP62V',
    },
  },
}
