import { ShopLayout } from '@/components/layouts'
import React from 'react'
import { Typography, Grid, Chip, Link } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import NextLink from 'next/link';

const columns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'ID',
        width: 100
    },
    {
        field: 'fullName',
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
                <NextLink href={`/orders/${params.row.id}`} passHref><Link component={'span'} underline='always'>Ver Orden</Link></NextLink>
            )
        }
    }
]

const rows = [
    {
        id: 1,
        fullName: 'Gustavo Arias',
        paid: true
    },
    {
        id: 2,
        fullName: 'Alessandro Arias',
        paid: false
    },
    {
        id: 3,
        fullName: 'Justin Arias',
        paid: true
    }
]

const HistoryPage = () => {
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

export default HistoryPage