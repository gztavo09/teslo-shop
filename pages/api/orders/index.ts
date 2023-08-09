// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from '@/database'
import { IOrder } from '@/interfaces'
import { Product, Order } from '@/models'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

type Data = 
    | { message: string}
    | IOrder

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    switch (req.method) {
        case 'POST':
            createOrder(req, res)
        default:
            res.status(400).json({ message: 'Bad Requested' })
    }
}

const createOrder = async(
    req: NextApiRequest,
    res: NextApiResponse<Data>
  ) => {
    const { orderItems, total } = req.body as IOrder
    const session: any = await getSession({ req })
    console.log({ session });

    if(!session) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const productsIds = orderItems.map((product: { _id: string }) => product._id)

    await db.connect()

    const dbProducts = await Product.find({ _id: {$in: productsIds} })

    try {
        const subtotal = orderItems.reduce((prev: any, current: any) => {
            const currentPrice = dbProducts.find(prod => prod._id === current._id)!.price

            if(!currentPrice) throw new Error('Verifique el carrito de nuevo, producto no existe')

            return [currentPrice * current.quantity] + prev
        }, 0)

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE ?? 0)
        const backendTotal = subtotal * ( taxRate + 1 )

        if(total !== backendTotal) throw new Error('El total no cuadra con el monto')
    
        const userId = session.user._id
        const newOrder =new Order({
            ...req.body,
            isPaid: false,
            user: userId
        })

        await newOrder.save()
        res.status(201).json(newOrder)


    } catch (error: any) {
        await db.disconnect()
        console.log("Error al calcular precio", error);
        return res.status(400).json({ message: error.message || 'Revise los logs del servidor' })
    }
    // res.status(201).json(session)
}