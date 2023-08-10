// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from '@/database'
import { IPaypal } from '@/interfaces'
import { Order } from '@/models'
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

type Data = 
    | { message: string }

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    switch(req.method) {
        case 'POST':
            return payOrder(req, res)
        default: 
            res.status(400).json({ message: 'John Doe' })
    }
}

const getPaypalBearearToken = async (): Promise<string | null> => {
    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET

    const base64Token = Buffer.from(`${ PAYPAL_CLIENT }:${ PAYPAL_SECRET }`, 'utf-8').toString('base64')
    const body = new URLSearchParams('grant_type=client_credentials')
    

    try {

        const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL ?? '', body, {
            headers: {
                'Authorization': `Basic ${ base64Token }`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        return data.access_token

    } catch (error) {
        if(axios.isAxiosError(error)) {
            console.log(error.response?.data);
        } else {
            console.log(error);
        }

        return null;
    }
}

export const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    //VALIDAR SESION DE USUARIO
    const session: any = await getServerSession(req as any, res as any, authOptions as any);
    if ( !session ) {
        return res.status(401).json({message: 'Debe de estar autenticado para hacer esto'});
    }

    //VALIDAR MONGOID

    const paypalBearerToken = await getPaypalBearearToken()

    if (!paypalBearerToken) return res.status(400).json({ message: 'No se pudo confirmar el token de paypal' })

    const { transactionId = '', orderId = '' } = req.body

    const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${ process.env.PAYPAL_ORDERS_URL }/${ transactionId }`, {
        headers: {
            'Authorization': `Bearer ${ paypalBearerToken }`
        }
    })

    if(data.status !== 'COMPLETED') {
        return res.status(401).json({ message: 'Orden no reconocida' })
    }

    await db.connect()

    const dbOrder = await Order.findById(orderId)

    if (!dbOrder) {
        await db.disconnect()
        return res.status(401).json({ message: 'Orden no existe' })
    }

    if(dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
        await db.disconnect()
        return res.status(400).json({ message: 'Los montos no coinciden' })
    }

    dbOrder.transactionId = transactionId
    dbOrder.isPaid = true
    await dbOrder.save()
    // PUEDES ENVIAR UN CORREO PARA AVISAR QUE HAY UN NUEVO PEDIDO
    await db.disconnect()

    return res.status(200).json({ message: paypalBearerToken })
}