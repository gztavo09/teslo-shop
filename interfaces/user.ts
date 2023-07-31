export interface IUser {
    _id: string
    name: string
    email: string
    password?: string // optional property to allow for partial updates of user data.
    role: string
    createdAt?: string
    updatedAt?: string | null  // nullable field since it's not always updated on every change (
}