import {
  ApolloClient,
  createHttpLink,
  InMemoryCache
} from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { useHelper } from '@/composables/useHelper'

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: import.meta.env.VFS_SERVER_ENDPOINT
  // uri: 'http://localhost:3006/graphql'
})

// Cache implementation
const cache = new InMemoryCache()

const authLink = setContext((_, { headers }) => {
  const token = useHelper().getUserToken()
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  connectToDevTools: true
})
