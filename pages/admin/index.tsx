import { SummaryTile } from '@/components/admin';
import { AdminLayout } from '@/components/layouts'
import { DashBoardSummaryResponse } from '@/interfaces';
import { AccessTimeFilledOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'

const DashboardPage = () => {

  const { data, error } = useSWR<DashBoardSummaryResponse>('/api/admin/dashboard', {
    refreshInterval: 30 * 1000 // 30 segundos
  })

  const [ refreshIn, setRefreshIn ] = useState(30)

  useEffect(() => {

    const interval = setInterval(() => {
      console.log('tick');
      setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn - 1 : 30)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if(!error && !data) return <></>

  if (error) {
    console.log(error);
    return <Typography>Error al cargar la info</Typography>
  }

  const { numberOfOrders,
          paidOrders,
          numberOfClients,
          numberOfProducts,
          producsWithNoInventory,
          lowInventory,
          notPaidOrders } = data!

  return (
    <AdminLayout
        title='Dashboard'
        subTitle='Estadisticas generales'
        icon={ <DashboardOutlined /> }
    >
        <Grid container spacing={2}>
          <SummaryTile  
            title={ numberOfOrders }
            subTitle='Ordenes totales'
            icon={ <CreditCardOutlined color='secondary' sx={{ fontSize: 40 }} /> }
          />

          <SummaryTile  
            title={ paidOrders }
            subTitle='Ordenes pagadas'
            icon={ <AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} /> }
          />

          <SummaryTile  
            title={ notPaidOrders }
            subTitle='Ordenes pendientes'
            icon={ <CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} /> }
          />

          <SummaryTile  
            title={ numberOfClients }
            subTitle='Clientes'
            icon={ <GroupOutlined color='primary' sx={{ fontSize: 40 }} /> }
          />

          <SummaryTile  
            title={ numberOfProducts }
            subTitle='Productos'
            icon={ <CategoryOutlined color='warning' sx={{ fontSize: 40 }} /> }
          />

          <SummaryTile  
            title={ producsWithNoInventory }
            subTitle='Sin existencias'
            icon={ <CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} /> }
          />

          <SummaryTile  
            title={ lowInventory }
            subTitle='Bajo inventario'
            icon={ <ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} /> }
          />

          <SummaryTile  
            title={ refreshIn }
            subTitle='Actualizacion en:'
            icon={ <AccessTimeFilledOutlined color='secondary' sx={{ fontSize: 40 }} /> }
          />
        </Grid>
    </AdminLayout>
  )
}

export default DashboardPage