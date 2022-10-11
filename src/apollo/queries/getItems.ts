import gql from 'graphql-tag'

export const itemsQuery = gql`
  query itemsQuery($folderId: String) {
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
