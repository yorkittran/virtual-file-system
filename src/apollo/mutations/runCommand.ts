import gql from 'graphql-tag'

export const runCommandMutation = gql`
  mutation runCommandMutation($command: String!, $folderId: String!) {
    runCommand(command: $command, folderId: $folderId) {
      error
      result
    }
  }
`
