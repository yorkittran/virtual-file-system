import gql from 'graphql-tag'

export const getItemsQuery = gql`
  query getItemsQuery($folderId: ID!) {
    items(folderId: $folderId) {
      folders {
        id
        name
        type
      }
      systemFiles {
        id
        name
        type
      }
    }
  }
`
