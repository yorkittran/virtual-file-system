import { defineStore } from 'pinia'
import { UserState } from '@/stores/types'

import router, { ROUTES } from '@/router'
import { provideApolloClient } from '@vue/apollo-composable'
import { apolloClient } from '@/service/apolloClient'

import { useRegister } from '@/composables/useRegister'
import { useSignIn } from '@/composables/useSignIn'
import { useGetMe } from '@/composables/useGetMe'
import { useSignOut } from '@/composables/useSignOut'
import { User, RegisterInput, SignInInput } from '@/apollo/types'
import { useHelper } from '@/composables/useHelper'

import { useFolderStore } from '@/stores/folder'

provideApolloClient(apolloClient)
const helper = useHelper()

export const useUserStore = defineStore({
  id: 'user',

  state: (): UserState => {
    return {
      user: undefined
    }
  },

  getters: {
    email: (state): string | undefined => {
      return state.user?.email
    }
  },

  actions: {
    async doneLogin(user: User, accessToken: string) {
      this.user = { ...user }
      helper.setUserToken(accessToken)
      router.push({ name: ROUTES.HOME.name })

      await useFolderStore().getFolderItems({ folderId: user.rootFolder.id })

      useFolderStore().handlePath('root', this.user.rootFolder.id)
      useFolderStore().setCliCurrentFolderId(this.user.rootFolder.id)
    },

    async register(payload: RegisterInput) {
      if (
        !payload.email ||
        !payload.password ||
        !payload.passwordConfirmation
      ) {
        alert('All fields are required!')
        return
      }
      if (payload.password !== payload.passwordConfirmation) {
        alert('Password and Confirm Password do not match!')
        return
      }

      try {
        const { useRegisterMutate } = useRegister()

        const response = await useRegisterMutate(payload)
        const data = response?.data?.register

        if (response?.errors?.length) {
          throw response.errors
        } else if (data) {
          this.doneLogin(data.user, data.accessToken)
        }
      } catch (error: any) {
        helper.handleError(error, 'user/register')
      }
    },

    async signIn(payload: SignInInput) {
      if (!payload.email || !payload.password) {
        alert('Email and password are required!')
        return
      }

      try {
        const { useSignInMutate } = useSignIn()

        const response = await useSignInMutate(payload)
        const data = response?.data?.signIn

        if (response?.errors?.length) {
          throw response.errors
        } else if (data) {
          this.doneLogin(data.user, data.accessToken)
        }
      } catch (error: any) {
        helper.handleError(error, 'user/signIn')
      }
    },

    async getMe(): Promise<void | string[]> {
      try {
        const { me, getMeQuery, getMeOnResult } = useGetMe()
        await getMeQuery()
        getMeOnResult(({ loading, error }) => {
          if (loading || error) return [error]

          if (me.value) {
            this.user = { ...me.value }

            useFolderStore().getFolderItems({
              folderId: this.user.rootFolder.id
            })
            useFolderStore().handlePath('root', this.user.rootFolder.id)
            useFolderStore().setCliCurrentFolderId(this.user.rootFolder.id)
          }
        })
      } catch (error: any) {
        helper.handleError(error, 'user/getMe')
      }
    },

    async signOut() {
      try {
        const { useSignOutMutate } = useSignOut()
        await useSignOutMutate()
        this.user = undefined
        helper.removeUserToken()
        router.push({ name: ROUTES.LOGIN.name })
        window.location.reload()
      } catch (error: any) {
        helper.handleError(error, 'user/signOut')
      }
    }
  }
})
