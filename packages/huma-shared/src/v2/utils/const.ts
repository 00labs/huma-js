import { BigNumber } from 'ethers'

export const SECONDS_IN_A_DAY = 86400

export const BP_FACTOR = BigNumber.from(10000)

export enum KYC_PROVIDER {
  Securitize = 'Securitize',
  Persona = 'Persona',
}

export enum CreditStateV2 {
  Deleted,
  Approved,
  GoodStanding,
  Delayed,
  Defaulted,
}

export enum PoolStatusV2 {
  Off, // The pool is temporarily turned off.
  On, // The pool is active.
  Closed, // The pool is permanently closed after maturity.
}

export const ARF_PERSONA_KYC_COPY = {
  signInRequired: {
    title: 'Sign In',
    description:
      'Please sign in to verify that you are the owner of the wallet.',
  },
  verifyIdentity: {
    title: 'Start KYC/KYB',
    description: `This pool is only available to verified investors at the moment. Please complete identity verification via ${KYC_PROVIDER.Persona}.`,
    buttonText: 'START KYC/KYB',
  },
  verificationDeclined: {
    title: 'Verification Declined',
    description:
      'Your verification request has been declined. Please contact support for more information.',
  },
  verificationNeedsReview: {
    title: 'Verification Needs Review',
    description:
      'Your verification request is under review. Please check back later.',
  },
  verificationApproved: {
    title: 'Verification Approved',
    description:
      'Congratulations! You have been approved as a lender for Arf pools. Next, please proceed to purchase agreement.',
    buttonText: 'GO TO PURCHASE AGREEMENT',
  },
  verificationBypassed: {
    title: 'Verification Bypassed',
    description:
      'Our testnet campaign is so popular that we have reached the daily KYC/KYB testing limit. We will bypass this step and allowlist you as an approved testing lender so that you can continue with the remaining testing.',
    buttonText: 'GO TO PURCHASE AGREEMENT',
  },
}

export const ARF_3_MONTH_POOL_SCROLL_MAP = {
  poolOld: '0x5227254a6aCa397e95F310b52f6D3143A5A9Ee14',
  poolNew: '0x51051d2E2bac59b525C7f001E91d31193c4CafFe',
  seniorTrancheOld: '0x4cdCedcF50266aD9ed809048BC9874320EC902bC',
  seniorTrancheNew: '0xD8208374c5E358031e7A81392F705c04106bB990',
  juniorTrancheOld: '0x483D02C11f8F1E31C267040A6C86AaB80c428BaB',
  juniorTrancheNew: '0xB135B9cfE868D456B5Fa480817E830960BdE80b3',
}
