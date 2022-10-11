import gql from 'graphql-tag'

export const itemsQuery = gql`
  query itemsQuery($folderId: ID!) {
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
