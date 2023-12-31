import { AdminLayout } from '@/components/layouts'
import { IUser } from '@/interfaces'
import { PeopleOutline } from '@mui/icons-material'
import { Grid } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React from 'react'
import useSWR from 'swr';



const UsersPage = () => {

    const { data, error } = useSWR<IUser[]>('/api/admin/users')

    if (!data && !error) return <></>

    const columns: GridColDef[] = [
        {
            field: 'email',
            headerName: 'Correo',
            width: 250
        },
        {
            field: 'name',
            headerName: 'Nombre completo',
            width: 300
        },
        {
            field: 'role',
            headerName: 'Rol',
            width: 300
        },
    ]

    const rows = data!.map( user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    }))

    return (
        <AdminLayout
            title='Usuarios'
            subTitle='Mantenimiento'
            icon={<PeopleOutline /> }
        >
            <Grid container>
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={ rows }
                        columns={ columns } 
                    />
                </Grid>
            </Grid>
        </AdminLayout>
    )
}

export default UsersPage