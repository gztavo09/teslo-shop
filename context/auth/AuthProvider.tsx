import { FC, useEffect, useReducer } from 'react'
import { AuthContext, authReducer } from './'
import { IUser } from '@/interfaces/user'
import { tesloApi } from '@/api'
import Cookies from 'js-cookie'
import axios from 'axios';
import { useRouter } from 'next/router'
import { useSession, signOut } from 'next-auth/react'

export interface AuthState {
    isLoggedIn: boolean,
    user?: IUser
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined
}

export const AuthProvider: FC<any> = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)
    const router = useRouter()
    const { data, status } = useSession()

    useEffect(() => {
        if(status === 'authenticated') {
            dispatch({ type: '[Auth] - Login', payload: data?.user as IUser })
        }
    }, [status, data])
    

    const loginUser = async (email: string, password: string ):Promise<boolean> => {
        try {
            const { data } = await tesloApi.post('/user/login', { email, password })
            const { token, user } = data
            Cookies.set('token', token)
            dispatch({ type: '[Auth] - Login', payload: user })
            return true

        } catch (error) {
            console.log('Error:', error);
            return false
        }
    }

    const registerUser = async (name: string, email: string, password: string ): Promise<{ hasError: boolean, message?: string }> => {
        try {
            const { data } = await tesloApi.post('/user/register', { name, email, password })
            const { token, user } = data
            Cookies.set('token', token)
            dispatch({ type: '[Auth] - Login', payload: user })
            return {
                hasError: false,
            }
        } catch (error) {
            if(axios.isAxiosError(error)) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }

            return {
                hasError: true,
                message: 'No se pudo crear el usuario - intente de nuevo'
            }
        }
    }

    const logout = () => {
        
        // Cookies.remove('token')
        Cookies.remove('cart')
        Cookies.remove('name')
        Cookies.remove('lastName') 
        Cookies.remove('address') 
        Cookies.remove('address2')
        Cookies.remove('zip')
        Cookies.remove('city')
        Cookies.remove('country')
        Cookies.remove('phone') 
        // router.reload()
        signOut()
    }

    return (
        <AuthContext.Provider value={{
            ...state,
            //Methods
            loginUser,
            registerUser,
            logout
        }}>
            {
                 children
            }
       </AuthContext.Provider>
    )
}