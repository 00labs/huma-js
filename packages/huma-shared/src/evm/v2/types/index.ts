import { IdentityVerificationStatusV2 } from '../../../common'

export enum FirstLossCoverIndex {
  borrower = 0,
  admin = 2,
}

export interface CloseModalOptions {
  identityStatus?: IdentityVerificationStatusV2
  isSuccess?: boolean
}
