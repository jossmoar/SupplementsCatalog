import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db, ADMIN_EMAILS } from '../firebase/config'

export interface UserProfile {
  name: string
  phone: string
  address: string
}

interface AuthContextValue {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      try {
        if (firebaseUser) {
          const ref = doc(db, 'users', firebaseUser.uid)
          const snap = await getDoc(ref)
          if (snap.exists()) {
            setProfile(snap.data() as UserProfile)
          } else {
            const initial: UserProfile = {
              name: firebaseUser.displayName ?? '',
              phone: '',
              address: '',
            }
            await setDoc(ref, initial)
            setProfile(initial)
          }
        } else {
          setProfile(null)
        }
      } catch (err) {
        console.error('No se pudo cargar el perfil del usuario:', err)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    })
    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signup = async (name: string, email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })
    await setDoc(doc(db, 'users', cred.user.uid), {
      name,
      phone: '',
      address: '',
    })
  }

  const logout = async () => {
    await signOut(auth)
  }

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid), data)
    setProfile((prev) => (prev ? { ...prev, ...data } : prev))
  }

  const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase())

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, isAdmin, login, signup, logout, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
