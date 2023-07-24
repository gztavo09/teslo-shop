import { ICartProduct } from "@/interfaces";
import { CartState } from "./";

type CartActionType =
    | { type: '[Cart] - LoadCart from cookias | storage', payload: ICartProduct[] }
    | { type: '[Cart] - Update products in cart', payload: ICartProduct[] }
    | { type: '[Cart] - Change quantity product', payload: ICartProduct }
    | { type: '[Cart] - Remove product in cart', payload: ICartProduct }
    | { type: '[Cart] - Update order summary',
        payload: {
            numberOfItems: number,
            subTotal: number,
            tax: number,
            total: number
        }}

export const cartReducer = ( state: CartState, action: CartActionType ) : CartState => {
    switch (action.type) {
        case '[Cart] - LoadCart from cookias | storage':
            return {
                ...state,
                cart: [ ...action.payload ]
            }
        case '[Cart] - Update products in cart':
            return {
                ...state,
                cart: [ ...action.payload ]
            }
        case '[Cart] - Change quantity product':
            return {
                ...state,
                cart: state.cart.map(product => {
                    if(product._id !== action.payload._id) return product     
                    if(product.size !== action.payload.size) return product     
                    product.quantity = action.payload.quantity
                    return action.payload
                })
            }
        case '[Cart] - Remove product in cart':
            return {
                ...state,
                cart: state.cart.filter(product => !(product._id === action.payload._id && product.size === action.payload.size))
            }
        case '[Cart] - Update order summary':
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}