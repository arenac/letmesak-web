import { useContext } from 'react'
import { AuthContext } from 'context/AuthContextProvider'

export function useAuth() {
  const context = useContext(AuthContext)
  return context
}