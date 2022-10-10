import gql from 'graphql-tag'

export const signInMutation = gql`
  mutation signInMutation($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
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
