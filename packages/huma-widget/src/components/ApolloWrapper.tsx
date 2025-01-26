import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

import { WCProps } from '../utilTypes'

export function ApolloWrapper({
  uri,
  children,
}: WCProps<{ uri: string }>): React.ReactElement | null {
  const client = new ApolloClient({
    uri,
    cache: new InMemoryCache(),
  })

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
