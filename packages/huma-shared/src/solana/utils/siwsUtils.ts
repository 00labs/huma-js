import moment from 'moment'

export class SiwsMessage {
  /** RFC 4501 dns authority that is requesting the signing. */
  domain: string

  /** Solana address performing the signing conformant to capitalization */
  address: string

  /** Human-readable ASCII assertion that the user will sign, and it must not
   * contain `\n`. */
  statement: string

  /** RFC 3986 URI referring to the resource that is the subject of the signing
   *  (as in the __subject__ of a claim). */
  uri: string

  /** Current version of the message. */
  version: string

  /** Solana Chain ID to which the session is bound, and the network where
   * Contract Accounts must be resolved. */
  chainId: string

  /** Randomized token used to prevent replay attacks, at least 8 alphanumeric
   * characters. */
  nonce: string

  /** ISO 8601 datetime string of the current time. */
  issuedAt: string

  /** ISO 8601 datetime string that, if present, indicates when the signed
   * authentication message is no longer valid. */
  expirationTime: string

  constructor(param: Omit<SiwsMessage, 'issuedAt' | 'prepareMessage'>) {
    this.domain = param.domain
    this.address = param.address
    this.statement = param.statement
    this.uri = param.uri
    this.version = param.version
    this.chainId = param.chainId
    this.nonce = param.nonce
    this.issuedAt = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSSSSS')
    this.expirationTime = param.expirationTime
  }

  prepareMessage(): string {
    const headerPrefix = this.domain
    const header = `${headerPrefix} wants you to sign in with your Solana account:`
    const uriField = `URI: ${this.uri}`
    let prefix = [header, this.address].join('\n')
    const versionField = `Version: ${this.version}`

    const chainField = `Chain ID: ${this.chainId}` || '1'

    const nonceField = `Nonce: ${this.nonce}`

    const suffixArray = [uriField, versionField, chainField, nonceField]

    this.issuedAt = this.issuedAt || new Date().toISOString()

    suffixArray.push(`Issued At: ${this.issuedAt}`)

    const expiryField = `Expiration Time: ${this.expirationTime}`

    suffixArray.push(expiryField)

    const suffix = suffixArray.join('\n')
    prefix = [prefix, this.statement].join('\n\n')
    if (this.statement) {
      prefix += '\n'
    }
    return [prefix, suffix].join('\n')
  }
}
