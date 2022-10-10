import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: {} as any
  }),
  getters: {
    getUserFullName: (state) => state.user.firstName + ' ' + state.user.lastName
  },
  actions: {
    setUser(payload: any) {
      this.user = payload
    }
  }
})
