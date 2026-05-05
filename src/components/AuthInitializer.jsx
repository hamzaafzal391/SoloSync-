import { onAuthStateChanged } from 'firebase/auth'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { auth } from '../firebase'
import { setAuthReady, setAuthUser } from '../store/authSlice'

function mapUser(user) {
  if (!user) return null
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  }
}

export function AuthInitializer() {
  const dispatch = useDispatch()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      dispatch(setAuthUser(mapUser(user)))
      dispatch(setAuthReady(true))
    })
    return () => unsub()
  }, [dispatch])

  return null
}
