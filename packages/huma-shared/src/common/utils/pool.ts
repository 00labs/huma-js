export enum POOL_NAME {
  HumaCreditLine = 'HumaCreditLine',
  ReceivableBackedCreditLine = 'ReceivableBackedCreditLine',
  Superfluid = 'Superfluid',
  Jia = 'Jia',
  JiaV2 = 'JiaV2',
  JiaUSDC = 'JiaUSDC',
  ArfCreditPool1 = 'ArfCreditPool1',
  ArfCreditPoolV2 = 'ArfCreditPoolV2',
  ArfCreditPool3Months = 'ArfCreditPool3Months',
  ArfCreditPool6Months = 'ArfCreditPool6Months',
  ArfCreditPool12Months = 'ArfCreditPool12Months',
  ArfPoolUSDC = 'ArfPoolUSDC',
  ArfPoolPYUSD = 'ArfPoolPYUSD',
  BSOS = 'BSOS',
  ImpactMarket = 'ImpactMarket',
  Raincards = 'Raincards',
  Quipu = 'Quipu',
  Roam = 'Roam',
}

export enum POOL_TYPE {
  Invoice = 'Invoice',
  CreditLine = 'CreditLine',
  Stream = 'Stream',
  ReceivableBackedCreditLine = 'ReceivableBackedCreditLine',
}

export enum REDIRECTS {
  Jia = '/Jia',
  Arf = '/Arf',
  BSOS = '/BSOS',
  ImpactMarket = '/impactMarket',
  Rain = '/Rain',
}

export type TrancheType = 'senior' | 'junior'

export type IndustryType =
  | 'Supply Chain Financing'
  | 'Remittance Financing'
  | 'Green Financing'
  | 'Invoice Factoring'
  | 'None'

export type KYCCopy = {
  title: string
  description: string
  buttonText?: string
}

export type KYCType = {
  Securitize?: {
    signInRequired: KYCCopy
    verifyIdentity: KYCCopy
    emailSignatureLink: KYCCopy
    resendSignatureLink: KYCCopy
    docUnderReview: KYCCopy
  }
  Persona?: {
    signInRequired: KYCCopy
    verifyIdentity: KYCCopy
    verificationDeclined: KYCCopy
    verificationNeedsReview: KYCCopy
    verificationApproved: KYCCopy
    verificationBypassed: KYCCopy
  }
}
