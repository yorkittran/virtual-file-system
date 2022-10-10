import { useMutation } from '@vue/apollo-composable'
import { registerMutation } from '@/apollo/mutations/register'
import { RegisterInput, RegisterResponse } from '@/apollo/types'

export const useRegister = () => {
  const {
    loading,
    mutate: useRegisterMutate,
    onError: useRegisterMutateError
  } = useMutation<RegisterResponse, RegisterInput>(registerMutation, {
    throws: 'always'
  })
  return { loading, useRegisterMutate, useRegisterMutateError }
}
