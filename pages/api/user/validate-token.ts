import { db } from '@/database';
import { User } from '@/models';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { jwt } from '@/utils';

type Data =
    | { message: string }
    | {
        token: string;
        user: {
            email: string;
            name: string;
            role: string
        }
    }


export default function handler(req:NextApiRequest, res:NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return validateToken(req, res)
        default:
            res.status(400).json({ message: 'Endpoint doesnt exist' })
    }
}

const validateToken = async (req:NextApiRequest, res:NextApiResponse<Data>) => {
    const { token = '' } = req.cookies
    let userId = ''

    try {
        userId = await jwt.isValidToken(token)
    } catch (error) {
        res.status(401).json({ message: 'El token no es válido' })
    }

    await db.connect()
    const user = await User.findById(userId).lean()
    await db.disconnect()

    if(!user) return res.status(400).json({ message: 'No existe el usuario con ese ID'})
    // if(!bcrypt.compareSync(password, user.password!)) return res.status(400).json({ message: 'Correo o contraseña inválidos -PASS'})

    const { role, name, email, _id } = user

    const newToken = jwt.signToken(_id, email)

    return res.status(200).json({
        token: newToken,
        user: {
            email, role, name
        }
    })
}