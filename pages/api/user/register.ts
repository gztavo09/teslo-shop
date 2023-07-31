import { db } from '@/database';
import { User } from '@/models';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { isValidEmail, jwt } from '@/utils';

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
        case 'POST':
            return registerUser(req, res)
        default:
            res.status(400).json({ message: 'Endpoint doesnt exist' })
    }
}

const registerUser = async (req:NextApiRequest, res:NextApiResponse<Data>) => {
    const { email = '', password = '', name='' } = req.body
 
    if(password.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe ser de 6 caractéres o más'})
    }

    if(name.length < 2) {
        return res.status(400).json({ message: 'El nombre debe ser de 2 caractéres o más'})
    }

    if(!isValidEmail(email)) {
        return res.status(400).json({ message: 'Correo no válido'})
    }

    await db.connect()

    const user = await User.findOne({ email }).lean()

    if(user) {
        await db.disconnect()    
        return res.status(400).json({ message: 'El correo ya está en uso'})
    }

    const newUser = new User({
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync(password),
        role: 'client',
        name
    })

    try {
        await newUser.save({ validateBeforeSave: true })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Revisar log del servidor'})
    }

    const { _id, role } = newUser

    const token = jwt.signToken(_id, email)

    return res.status(200).json({
        token,
        user: {
            email, role, name
        }
    })
}