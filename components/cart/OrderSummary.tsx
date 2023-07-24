import { CartContext } from '@/context'
import { format } from '@/utils'
import { Grid, Typography } from '@mui/material'
import React, { useContext } from 'react'

export const OrderSummary = () => {

    const { numberOfItems, subTotal, tax, total } = useContext(CartContext)
    

  return (
    <Grid container>
        <Grid item xs={6}>
            <Typography>No. Productos</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{ numberOfItems } producto(s)</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography>SubTotal</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{ format(subTotal) }</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography>Impuestos { Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100 }% </Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{ format(tax) }</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant='subtitle1'>Total</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography variant='subtitle1'>{ format(total) }</Typography>
        </Grid>
    </Grid>
  )
}
