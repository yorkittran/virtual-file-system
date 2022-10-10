import { computed, ref } from 'vue'
import { useLazyQuery } from '@vue/apollo-composable'
import { meQuery } from '@/apollo/queries/getMe'
import { GetMeResponse } from '@/apollo/types/index'

export const useGetMe = () => {
  const queryCalled = ref(false)

  const {
    loading,
    load,
    refetch,
    result,
    onResult: getMeOnResult,
    onError: getMeOnError
  } = useLazyQuery<GetMeResponse>(meQuery, {
    fetchPolicy: 'no-cache'
  })

  const getMeQuery = async () => {
    try {
      if (queryCalled.value) {
        await refetch()
      } else {
        await load()
      }
    } catch (error) {
      console.log('useGetMe', error)
    }

    queryCalled.value = true
  }

  const me = computed(() => result.value?.me)

  return {
    me,
    loading,
    getMeQuery,
    getMeOnResult,
    getMeOnError
  }
}
