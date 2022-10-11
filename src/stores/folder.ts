import { defineStore } from 'pinia'
import { FolderState } from '@/stores/types'

import { provideApolloClient } from '@vue/apollo-composable'
import { apolloClient } from '@/service/apolloClient'

import { useGetItems } from '@/composables/useGetItems'
import { useRunCommand } from '@/composables/useRunCommand'
import {
  GetItemsInput,
  RunCommandInput,
  RunCommandResponse
} from '@/apollo/types'
import { Folder, SystemFile } from '@/apollo/types/index'

import { useHelper } from '@/composables/useHelper'

provideApolloClient(apolloClient)
const helper = useHelper()

export const useFolderStore = defineStore({
  id: 'folder',

  state: (): FolderState => ({
    currentFolder: {
      id: '',
      path: [],
      name: '',
      folders: [],
      systemFiles: [],
      size: 0,
      type: ''
    },
    cliCurrentFolder: {
      id: '',
      path: [],
      name: '',
      folders: [],
      systemFiles: [],
      size: 0,
      type: ''
    },
    loading: false
  }),

  getters: {
    getCurrentFolderFolders: (state): Folder[] =>
      state.currentFolder.folders || [],
    getCurrentFolderSystemFiles: (state): SystemFile[] =>
      state.currentFolder.systemFiles || []
  },

  actions: {
    async getFolderItems(payload: GetItemsInput): Promise<void | string[]> {
      try {
        this.loading = true

        const { items, getItemsQuery, getItemsOnResult } = useGetItems()
        await getItemsQuery(payload)
        getItemsOnResult(({ error }) => {
          if (error) return [error]

          if (items.value) {
            this.currentFolder.id = payload.folderId
            this.currentFolder.folders = [
              ...items.value.folders.map((item) => ({
                ...item,
                path: []
              }))
            ]
            this.currentFolder.systemFiles = [...items.value.systemFiles]
          }
        })
        this.loading = false
      } catch (error: any) {
        helper.handleError(error, 'folder/getFolderItems')
      }
    },

    async runCommand(payload: RunCommandInput): Promise<void | {
      error: string
      result: string
      currentFolderId: string
    }> {
      try {
        const { useRunCommandMutate } = useRunCommand()

        const response = await useRunCommandMutate(payload)
        const data = response?.data?.runCommand

        if (response?.errors?.length) {
          throw response.errors
        } else if (data) {
          return data
        }
      } catch (error: any) {
        helper.handleError(error, 'user/register')
      }
    },

    handlePath(folderName: string, folderId: string): void {
      const index = this.currentFolder.path.findIndex(
        (path) => path.id === folderId
      )

      if (index === -1) {
        this.currentFolder.path.push({ name: folderName, id: folderId })
      } else {
        this.currentFolder.path = this.currentFolder.path.slice(0, index + 1)
      }
    },

    setCliCurrentFolderId(folderId: string): void {
      this.cliCurrentFolder.id = folderId
    }
  }
})
