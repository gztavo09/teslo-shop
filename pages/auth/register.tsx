import NextLink from 'next/link'
import { AuthLayout } from '@/components/layouts'
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form';
import { isEmail } from '@/utils';
import { ErrorOutline } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/auth';
import { getSession, signIn } from 'next-auth/react';
import { GetServerSideProps } from 'next';

type FormData = {
    email: string
    name: string
    password: string
}

const RegisterPage = () => {

    const {
        register, 
        handleSubmit, 
        formState: { errors }
    } = useForm<FormData>()

    const { registerUser } = useContext(AuthContext)
    const router = useRouter()

    const [errorMessage, setErrorMessage] = useState('')
    const [showError, setShowError] = useState(false)

    const onRegisterform = async ({ email, name, password }: FormData) => {
        setShowError(false)

        const {hasError, message} = await registerUser(name, email, password) 

        if (hasError) {
            setErrorMessage(message ?? '')
            setShowError(true)
            setTimeout(() => {
                setShowError(false)
            }, 3000)
            return
        }

        await signIn('credentials', { email, password })
    }

  return (
    <AuthLayout title='Login'>
        <form onSubmit={handleSubmit(onRegisterform)} noValidate>
            <Box sx={{ width: 350, padding: '10px 20px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h1' component='h1'>Crear cuenta</Typography>
                        {
                            showError && (
                                    <Chip 
                                        label={ errorMessage }
                                        color='error'
                                        icon={ <ErrorOutline /> }
                                        className='fadeIn my-2'
                                    />
                            )
                        }
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            label='Nombre' 
                            variant='filled' 
                            fullWidth 
                            {
                                ...register('name', {
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                                })
                            }
                            error={ !!errors.name }
                            helperText={ errors.name?.message }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            label='Correo' 
                            variant='filled' 
                            fullWidth 
                            {
                                ...register('email', {
                                    required: 'Este campo es requerido',
                                    validate:  (val) => isEmail(val)
                                })
                            }
                            error={ !!errors.email }
                            helperText={ errors.email?.message }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            label='Contraseña' 
                            type='password' 
                            variant='filled' 
                            fullWidth
                            {
                                ...register('password', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                                })
                            } 
                            error={ !!errors.password }
                            helperText={ errors.password?.message }
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button type='submit' color='secondary' className='circular-btn' size='large' fullWidth>
                            Crear cuenta
                        </Button>
                    </Grid>

                    <Grid item xs={12} display='flex' justifyContent='end'>
                        <NextLink href={`login?p=${router.query.p?.toString() ?? ''}`} passHref>
                        <Link component={'span'} underline='always'>
                                Ya tienes cuenta
                            </Link> 
                        </NextLink>
                    </Grid>
                </Grid>
            </Box>
        </form>
    </AuthLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const session = await getSession({ req })
    const destination = query.p?.toString() ?? '/'
    if(session) {
        return {
            redirect : {
                destination: destination,
                permanent: false
            }
        }
    }

    return {
        props: { }
    }
}

export default RegisterPage