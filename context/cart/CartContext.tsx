import { ICartProduct } from '@/interfaces';
import { createContext } from 'react';
import { ShippingAddress } from '@/interfaces';

interface ContextProps {
    isLoaded: boolean,
    cart: ICartProduct[],
    numberOfItems: number,
    subTotal: number,
    tax: number,
    total: number,
    shippingAddress?: ShippingAddress,

    addProductToCart: (product: ICartProduct) => void,
    updateCartQuantity: (product: ICartProduct) => void,
    deleteProductInCart: (product: ICartProduct) => void,
    updateAddress: (address: ShippingAddress) => void,

    createOrder: () => Promise<void>
}

export const CartContext = createContext({} as ContextProps)