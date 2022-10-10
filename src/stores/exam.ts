import { defineStore } from 'pinia'

export const useExamStore = defineStore({
  id: 'exam',
  state: () => ({
    exam: {} as any
  }),
  getters: {
    getExamQuestions: (state) => state.exam.questions
  },
  actions: {
    setExam(payload: any) {
      this.exam = payload
    }
  }
})
