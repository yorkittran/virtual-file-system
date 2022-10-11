import { computed, ref } from 'vue'
import { useLazyQuery } from '@vue/apollo-composable'
import { itemsQuery } from '@/apollo/queries/getItems'
import { GetItemsResponse, GetItemsInput } from '@/apollo/types/index'

export const useGetItems = () => {
  const queryCalled = ref(false)

  const {
    loading,
    load,
    refetch,
    result,
    onResult: getItemsOnResult,
    onError: getItemsOnError
  } = useLazyQuery<GetItemsResponse, GetItemsInput>(itemsQuery, {
    fetchPolicy: 'no-cache'
  })

  const getItemsQuery = async (payload: GetItemsInput) => {
    try {
      if (queryCalled.value) {
        console.log('in refetch')
        await refetch(payload)
      } else {
        await load(undefined, payload)
        console.log(getItemsOnResult)
      }
    } catch (error) {
      console.log('useGetItems', error)
    }

    queryCalled.value = true
  }

  const items = computed(() => result.value?.items)

  return {
    items,
    loading,
    getItemsQuery,
    getItemsOnResult,
    getItemsOnError
  }
}
