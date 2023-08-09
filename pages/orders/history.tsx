import { ShopLayout } from '@/components/layouts'
import React from 'react'
import { Typography, Grid, Chip, Link } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import NextLink from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';

const columns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'ID',
        width: 100
    },
    {
        field: 'fullname',
        headerName: 'Nombre completo',
        width: 300,
        sortable: false
    },
    {
        field: 'paid',
        headerName: 'Pagada',
        description: 'Muestra estado de pago',
        width: 200,
        sortable: true,
        renderCell: (params: GridValueGetterParams | any) => {
            return (
                params.row.paid
                    ? <Chip color='success' label='Pagada' variant='outlined' />
                    : <Chip color='error' label='No pagada' variant='outlined' />
            )
        }
    },
    {
        field: 'orden',
        headerName: 'Ver Orden',
        description: 'Muestra estado de pago',
        width: 200,
        renderCell: (params: GridValueGetterParams | any) => {
            return (
                <NextLink href={`/orders/${params.row.orderId}`} passHref><Link component={'span'} underline='always'>Ver Orden</Link></NextLink>
            )
        }
    }
]

interface Props {
    orders: IOrder[]
}

const HistoryPage: NextPage<Props> = (props) => {
    
    const rows = props.orders.map((order, idx) => ({
        id: idx + 1,
        paid: order.isPaid,
        fullname: `${order.shippingAddress.name} ${order.shippingAddress.lastName}`,
        orderId: order._id
    }))
    
  return (
    <ShopLayout title='Historial de compras' pageDescription='Historial de ordenes'>
        <Typography variant='h1' component='h1'>Historial de ordenes</Typography>
        <Grid container>
            <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                <DataGrid
                    rows={ rows }
                    columns={ columns } 
                />
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const session:any = await getSession({ req })

    if(!session) {
        return {
            redirect: {
                destination: `/auth/login?p=/orders/history`,
                permanent: false
            }
        }
    }

    const orders = await dbOrders.getOrderByUser(session.user._id)

    return {
        props: {
            orders
        }
    }
}

export default HistoryPage