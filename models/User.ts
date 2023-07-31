import { IUser } from "@/interfaces/user";
import mongoose, { Model, model, Schema} from "mongoose";

const userSchema = new Schema({
    name: {
        type: String, required: true
    },
    email: {
        type: String, required: true, unique: true
    },
    password: {
        type: String, required: true
    },
    rol: {
        type: String, 
        enum: {
            values: ['admin', 'client'],
            message:'{VALUE} no es un role válido',
            default: 'client',
            required: true
        }
    }
}, {
    timestamps: true
})

const User:Model<IUser> = mongoose.models.User || model('User', userSchema)

export default User