import { CartList, OrderSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material'
import { CreditCardOffOutlined, CreditCardOutlined } from '@mui/icons-material'
import NexLink from 'next/link'

const OrderPage = () => {
  return (
    <ShopLayout title='Resumen de orden 123123123' pageDescription='Resumen de la orden'>
        <Typography variant='h1' component='h1'>Orden: 123 </Typography>

        {/* <Chip
            sx={{ my: 2 }}
            label="Pendiente de pago"
            variant='outlined'
            color= 'error'
            icon={ <CreditCardOffOutlined /> }
        />    */}

        <Chip
            sx={{ my: 2 }}
            label="Pagado"
            variant='outlined'
            color= 'success'
            icon={ <CreditCardOutlined /> }
        />   

        <Grid container>
            <Grid item xs={ 12 } sm={ 7 }>
                <CartList />
            </Grid>
            <Grid item xs={ 12 } sm={ 5 }>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>Resumen (3 productos)</Typography>

                        <Divider sx={{ my: 1}} />

                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Dirección de entrega</Typography>
                            <NexLink href='/checkout/address' passHref>
                                <Link component={'span'} underline='always'>
                                    Editar
                                </Link>
                            </NexLink>
                        </Box>

                        
                        <Typography>Gustavo Arias</Typography>
                        <Typography>123 Algun lugar</Typography>
                        <Typography>Lima</Typography>
                        <Typography>Perú</Typography>

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
                            <Chip
                                sx={{ my: 2 }}
                                label="Pagado"
                                variant='outlined'
                                color= 'success'
                                icon={ <CreditCardOutlined /> }
                            />   
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default OrderPage