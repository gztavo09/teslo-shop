import { CartList, OrderSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { CartContext } from '@/context'
import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from '@mui/material'
import NexLink from 'next/link'
import { useContext, useEffect } from 'react'
import { countries } from '@/utils';
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

const SummaryPage = () => {

    const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext)
    const router = useRouter()

    useEffect(() => {
      if(!Cookies.get('name')) {
        router.push('/checkout/address')
      }
    }, [router])

    const onCreateOrder = () => {
        createOrder()
    }
    

    if(!shippingAddress) return <></>

  return (
    <ShopLayout title='Resumen de orden' pageDescription='Resumen de la orden'>
        <Typography variant='h1' component='h1'>Resumen de la orden</Typography>
        <Grid container>
            <Grid item xs={ 12 } sm={ 7 }>
                <CartList />
            </Grid>
            <Grid item xs={ 12 } sm={ 5 }>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>Resumen ({ numberOfItems } productos)</Typography>

                        <Divider sx={{ my: 1}} />

                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Dirección de entrega</Typography>
                            <NexLink href='/checkout/address' passHref>
                                <Link component={'span'} underline='always'>
                                    Editar
                                </Link>
                            </NexLink>
                        </Box>

                        
                        <Typography>{ shippingAddress.name ?? '' } { shippingAddress.lastName ?? '' }</Typography>
                        <Typography>{ shippingAddress.address ?? '' } { shippingAddress.address2 ?? '' }</Typography>
                        <Typography>{ shippingAddress.city ?? '' } - { countries.find((country) => country.code === shippingAddress.country)?.name }</Typography>
                        <Typography>{ shippingAddress.zip ?? '' }</Typography>
                        <Typography>{ shippingAddress.phone ?? '' }</Typography>

                        <Divider sx={{ my: 1}} />

                        <Box display='flex' justifyContent='end'>
                            <NexLink href='/checkout/address' passHref>
                                <Link component={'span'} underline='always'>
                                    Editar
                                </Link>
                            </NexLink>
                        </Box>

                        <OrderSummary />
                        <Box sx={{ mt: 3 }}>
                            <Button 
                                color='secondary' 
                                className='circular-btn' 
                                fullWidth
                                onClick={ onCreateOrder }
                            >
                                Confirmar orden
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default SummaryPage