import { CartList, OrderSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Link, Typography } from '@mui/material'
import { CreditCardOffOutlined, CreditCardOutlined } from '@mui/icons-material'
import { PayPalButtons } from "@paypal/react-paypal-js";
import NexLink from 'next/link'
import { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { dbOrders } from '@/database'
import { IOrder } from '@/interfaces'
import { tesloApi } from '@/api';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface Props {
    order: IOrder
}

export type OrderResponseBody = {
    id: string
    status: 
        | 'COMPLETED'
        | 'SAVED'
        | 'CREATED'
        | 'APPROVED'
        | 'VOIDED'
        | 'PAYER_ACTION_REQUIRED'
}

const OrderPage: NextPage<Props> = ({ order })  => {

    const router = useRouter()
    const [isPaying, setIsPaying] = useState(false)

    const onOrderCompleted = async (details: OrderResponseBody) => {
        if(details.status !== 'COMPLETED') return alert('No hay pago en Paypal')

        setIsPaying(true)

        try {

            const { data } = await tesloApi.post(`/orders/pay`, {
                transactionId: details.id,
                orderId: order._id
            })

            router.reload()

        } catch (error) {
            setIsPaying(false)
            alert('ERROR')
        }
    }

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

                            <Box 
                                justifyContent="center" 
                                className="fadeIn"
                                sx={{ display: isPaying ? 'flex' : 'none' }}>
                                <CircularProgress />
                            </Box>

                            <Box sx={{ display: !isPaying ? 'flex' : 'none' }} flexDirection='column'>
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
                                        <PayPalButtons 
                                            createOrder={(data, actions) => {
                                                return actions.order.create({
                                                    purchase_units: [
                                                        {
                                                            amount: {
                                                                value: order.total.toString()
                                                            }
                                                        }
                                                    ]
                                                });
                                            }}
                                            onApprove={(data, actions) => {
                                                return actions.order!.capture().then((details) => {
                                                    onOrderCompleted(details)
                                                    // const name = details.payer.name?.given_name
                                                })
                                            }}
                                        />
                                    )
                                }
                            </Box>
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