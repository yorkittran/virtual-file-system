import { TOKEN_KEY } from '@/data/constants'

export const useHelper = () => {
  const setUserToken = (token: string) => {
    sessionStorage.setItem(TOKEN_KEY, token)
  }

  const getUserToken = (): string | null => {
    return sessionStorage.getItem(TOKEN_KEY)
  }

  const removeUserToken = () => {
    sessionStorage.removeItem(TOKEN_KEY)
  }

  const hasUser = (): boolean => {
    const token = getUserToken()
    return !!token
  }

  const handleError = (error: any, location: string) => {
    if (Array.isArray(error.graphQLErrors)) {
      error.graphQLErrors.forEach((errorMsg: string) => alert(errorMsg))
    }
    console.error(location, JSON.stringify(error))
  }

  return {
    setUserToken,
    getUserToken,
    removeUserToken,
    hasUser,
    handleError
  }
}
