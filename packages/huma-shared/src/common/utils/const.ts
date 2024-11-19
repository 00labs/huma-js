export const SECONDS_IN_A_DAY = 86400

export enum KYC_PROVIDER {
  Securitize = 'Securitize',
  Persona = 'Persona',
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
