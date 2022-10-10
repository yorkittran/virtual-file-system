import { useMutation } from '@vue/apollo-composable'
import { runCommandMutation } from '@/apollo/mutations/runCommand'
import { RunCommandInput, RunCommandResponse } from '@/apollo/types'

export const useRunCommand = () => {
  const {
    loading,
    mutate: useRunCommandMutate,
    onError: useRunCommandMutateError
  } = useMutation<RunCommandResponse, RunCommandInput>(runCommandMutation, {
    throws: 'always'
  })
  return { loading, useRunCommandMutate, useRunCommandMutateError }
}
