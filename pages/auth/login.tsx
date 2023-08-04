import NextLink from 'next/link'
import { AuthLayout } from '@/components/layouts'
import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { isEmail } from '@/utils'
import { ErrorOutline } from '@mui/icons-material'
import { AuthContext } from '@/context/auth'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { signIn, getSession, getProviders } from 'next-auth/react'

type FormData = {
    email: string
    password: string
}

const LoginPage = () => {

    const { loginUser } = useContext(AuthContext)
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>()

    const [showError, setShowError] = useState(false)

    const [providers, setProviders] = useState<any>({})

    useEffect(() => {
        getProviders().then(prov => {
            setProviders(prov)
            console.log({ prov });
            
        })
    }, [])
    

    const onLoginUser = async ({ email, password }: FormData) => {
        setShowError(false)

        await signIn('credentials', { email, password })
        // const isValidLogin = await loginUser(email, password)

        // if(!isValidLogin) {
        //     setShowError(true)
        //     setTimeout(() => {
        //         setShowError(false)
        //     }, 3000)
        //     return;
        // }
        
        // const dest = router.query.p?.toString() ?? '/'
        // router.replace(dest)
    }

  return (
    <AuthLayout title='Login'>
        <form onSubmit={handleSubmit(onLoginUser)} noValidate>
            <Box sx={{ width: 350, padding: '10px 20px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant='h1' component='h1'>Iniciar sesión</Typography>
                        {
                            showError && (
                                        <Chip 
                                    label='No se reconoce el usuario/contraseña'
                                    color='error'
                                    icon={ <ErrorOutline /> }
                                    className='fadeIn my-2'
                                />
                            )
                        }
                        
                    </Grid>
                    <Grid item xs={12}>
                        <TextField 
                            type='email'
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
                            Ingresar
                        </Button>
                    </Grid>

                    <Grid item xs={12} display='flex' justifyContent='end'>
                        <NextLink href={`register?p=${router.query.p?.toString() ?? ''}`} passHref>
                        <Link component={'span'} underline='always'>
                                Registrarse
                            </Link> 
                        </NextLink>
                    </Grid>

                    <Grid item xs={12} display='flex' justifyContent='end'>
                            <Divider sx={{ width: '100%', mb: 2}} />
                    </Grid>

                    {
                        Object.values(providers).map((provider: any) => {
                            if(provider.id === 'credentials') return (<div key='credentials'></div>)
                            return (
                                <Button
                                    key={provider.id}
                                    variant='outlined'
                                    fullWidth
                                    color='primary'
                                    sx={{ mb: 1}}
                                    onClick={ () => signIn(provider.id) }
                                >
                                    { provider.name }
                                </Button>
                            )
                        })
                    }

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

export default LoginPage