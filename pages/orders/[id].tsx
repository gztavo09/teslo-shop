import { CartList, OrderSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material'
import { CreditCardOffOutlined, CreditCardOutlined } from '@mui/icons-material'
import NexLink from 'next/link'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { dbOrders } from '@/database'
import { IOrder } from '@/interfaces'

interface Props {
    order: IOrder
}

const OrderPage: NextPage<Props> = ({ order })  => {
  return (
    <ShopLayout title='Resumen de orden' pageDescription='Resumen de la orden'>
        <Typography variant='h1' component='h1'>Orden: { order._id } </Typography>

        {
            order.isPaid
            ? (
                <Chip
                    sx={{ my: 2 }}
                    label="Pagado"
                    variant='outlined'
                    color= 'success'
                    icon={ <CreditCardOutlined /> }
                />  
            )
            : (
                <Chip
                    sx={{ my: 2 }}
                    label="Pendiente de pago"
                    variant='outlined'
                    color= 'error'
                    icon={ <CreditCardOffOutlined /> }
                /> 
            )
        }

        <Grid container>
            <Grid item xs={ 12 } sm={ 7 }>
                <CartList products={ order.orderItems } />
            </Grid>
            <Grid item xs={ 12 } sm={ 5 }>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>Resumen ({ order.numberOfItems } producto(s))</Typography>

                        <Divider sx={{ my: 1}} />

                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Dirección de entrega</Typography>
                        </Box>

                        
                        <Typography>{ order.shippingAddress.name } { order.shippingAddress.lastName }</Typography>
                        <Typography>{ order.shippingAddress.address }</Typography>
                        <Typography>{ order.shippingAddress.city }, { order.shippingAddress.zip }</Typography>
                        <Typography>{ order.shippingAddress.country }</Typography>
                        <Typography>{ order.shippingAddress.phone }</Typography>

                        <Divider sx={{ my: 1}} />

                        <Box display='flex' justifyContent='end'>
                            <NexLink href='/checkout/address' passHref>
                                <Link component={'span'} underline='always'>
                                    Editar
                                </Link>
                            </NexLink>
                        </Box>

                        <OrderSummary orderValues={{ numberOfItems: order.numberOfItems, tax: order.tax, subTotal: order.subTotal, total: order.total }} />
                        <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                            {
                                order.isPaid
                                ? (
                                    <Chip
                                        sx={{ my: 2 }}
                                        label="Pagado"
                                        variant='outlined'
                                        color= 'success'
                                        icon={ <CreditCardOutlined /> }
                                    />   
                                )
                                : (
                                    <h2>Pagar</h2>
                                )
                            }
                            
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const { id = '' } = query
    const session: any = await getSession({ req })

    if(!session) {
        return {
            redirect: {
                destination: `/auth/login?p=/orders/${id}`,
                permanent: false
            }
        }
    }

    const order = await dbOrders.getOrderById(id.toString())

    if(!order) {
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false
            }
        }
    }

    if(order.user !== session.user._id) {
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false
            }
        }
    }

    return {
        props: {
            order
        }
    }
}

export default OrderPage