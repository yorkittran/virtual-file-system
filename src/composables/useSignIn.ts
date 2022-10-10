import { useMutation } from '@vue/apollo-composable'
import { signInMutation } from '@/apollo/mutations/signIn'
import { SignInInput, SignInResponse } from '@/apollo/types'

export const useSignIn = () => {
  const {
    loading,
    mutate: useSignInMutate,
    onError: useSignInMutateError
  } = useMutation<SignInResponse, SignInInput>(signInMutation, {
    throws: 'always'
  })
  return { loading, useSignInMutate, useSignInMutateError }
}
