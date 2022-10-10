import { useMutation } from '@vue/apollo-composable'
import { signOutMutation } from '@/apollo/mutations/signOut'

export const useSignOut = () => {
  const {
    loading,
    mutate: useSignOutMutate,
    onError: useSignOutMutateError
  } = useMutation(signOutMutation, {
    throws: 'always'
  })
  return { loading, useSignOutMutate, useSignOutMutateError }
}
