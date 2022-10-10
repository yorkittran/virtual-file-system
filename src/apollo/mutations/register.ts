import gql from 'graphql-tag'

export const registerMutation = gql`
  mutation registerMutation(
    $email: String!
    $password: String!
    $passwordConfirmation: String!
  ) {
    register(
      email: $email
      password: $password
      passwordConfirmation: $passwordConfirmation
    ) {
      accessToken
      user {
        id
        email

        rootFolder {
          id
        }
      }
    }
  }
`
