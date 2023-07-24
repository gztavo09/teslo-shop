// mens_chill_crew_neck_sweatshirt
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from '@/database'
import { IProduct } from '@/interfaces'
import { Product } from '@/models'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = 
    | { message: string }
    | IProduct

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    const { slug } = req.query

    switch (req.method) {
        case 'GET':
            return getProductBySlug(req, res)
        default:
            return res.status(400).json({ message: 'Metodo no existe' + slug })
    }  
}

async function getProductBySlug(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { slug } = req.query

    try {
        await db.connect()
        const product = await Product.findOne({
            slug
        })
        .lean()

        await db.disconnect()

        if(!product) {
            return res.status(400).json({ message: 'No existe el producto' + slug })
        }

        return res.status(200).json(product)
    } catch(error: any) {
        console.log(error);
        res.status(400).json({ message: error.errros.status})
    }
}

