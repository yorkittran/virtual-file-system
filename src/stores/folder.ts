import { defineStore } from 'pinia'
import { FolderState } from '@/stores/types'

import { provideApolloClient } from '@vue/apollo-composable'
import { apolloClient } from '@/service/apolloClient'

import { useGetItems } from '@/composables/useGetItems'
import { useRunCommand } from '@/composables/useRunCommand'
import { GetItemsInput, RunCommandInput } from '@/apollo/types'

import { useHelper } from '@/composables/useHelper'

provideApolloClient(apolloClient)
const helper = useHelper()

export const useFolderStore = defineStore({
  id: 'folder',

  state: (): FolderState => ({
    currentFolder: {
      id: '',
      path: '',
      name: '',
      folders: [],
      systemFiles: [],
      size: 0,
      type: ''
    },
    cliCurrentFolder: {
      id: '',
      path: '',
      name: '',
      folders: [],
      systemFiles: [],
      size: 0,
      type: ''
    }
  }),

  getters: {
    getCurrentFolderSize: (state): number => state.currentFolder.size || 0,

    getCliCurrentFolderSize: (state): number => state.cliCurrentFolder.size || 0
  },

  actions: {
    async getFolderItems(payload: GetItemsInput): Promise<void | string[]> {
      try {
        const { items, getItemsQuery, getItemsOnResult } = useGetItems()
        await getItemsQuery(payload)
        getItemsOnResult(({ error }) => {
          if (error) return [error]

          if (items.value) {
            this.currentFolder.id = payload.folderId
            this.cliCurrentFolder.id = payload.folderId
            this.currentFolder.folders = [...items.value.folders]
            this.currentFolder.systemFiles = [...items.value.systemFiles]
          }
        })
      } catch (error: any) {
        helper.handleError(error, 'folder/getFolderItems')
      }
    },

    async runCommand(payload: RunCommandInput): Promise<void | string> {
      try {
        const { useRunCommandMutate } = useRunCommand()

        const response = await useRunCommandMutate(payload)
        const data = response?.data?.runCommand

        if (response?.errors?.length) {
          throw response.errors
        } else if (data) {
          return data.result || data.error
        }
      } catch (error: any) {
        helper.handleError(error, 'user/register')
      }
    }
  }
})
