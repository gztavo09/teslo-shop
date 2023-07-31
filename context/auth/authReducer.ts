import { IUser } from "@/interfaces";
import { AuthState } from "./";

type CartActionType =
    | { type: '[Auth] - Login', payload: IUser }
    | { type: '[Auth] - Logout' }
    

export const authReducer = ( state: AuthState, action: CartActionType ) : AuthState => {
    switch (action.type) {
        case '[Auth] - Login':
            return {
                ...state,
                isLoggedIn: true,
                user: action.payload
            }
        case '[Auth] - Logout':
            return {
                ...state,
                user: undefined,
                isLoggedIn: false
            }
        default:
            return state;
    }
}