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

export const PERSONA_KYC_COPY = {
  signInRequired: {
    title: 'Sign In',
    description:
      'Please sign in to verify that you are the owner of the wallet.',
  },
  verifyIdentity: {
    title: 'Start KYC',
    description: `This pool is only available to accredited investors at the moment. Please complete identity verification and investor accreditation via ${KYC_PROVIDER.Persona}.`,
    buttonText: 'START KYC',
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
      'Your verification request is approved. Please check and agree the subscription agreement.',
    buttonText: 'GO TO SUBSCRIPTION',
  },
}
