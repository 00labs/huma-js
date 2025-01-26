import { GraphQLClient } from 'graphql-request'
import gql from 'graphql-tag'

export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type Receivable = {
  __typename?: 'Receivable'
  creationDate?: Maybe<Scalars['String']>
  currencyCode?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['String']>
  lastUpdate?: Maybe<Scalars['String']>
  maturityDate?: Maybe<Scalars['String']>
  owner?: Maybe<Scalars['String']>
  paidAmount?: Maybe<Scalars['String']>
  pool?: Maybe<Scalars['String']>
  receivableAmount?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
  tokenId?: Maybe<Scalars['String']>
  uri?: Maybe<Scalars['String']>
}

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
) => Promise<T>

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType,
) => action()

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper,
) {
  return {}
}
export type Sdk = ReturnType<typeof getSdk>
