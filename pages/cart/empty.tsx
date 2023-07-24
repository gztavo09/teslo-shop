import NextLink from 'next/link'
import { ShopLayout } from '@/components/layouts'
import { Box, Link, Typography } from '@mui/material'
import { RemoveShoppingCartOutlined } from '@mui/icons-material'
import React from 'react'

const EmptyPage = () => {
  return (
    <ShopLayout title='Carrito vacío' pageDescription='No hay artículos'>
        <Box  sx={{ flexDirection: {
              xs: 'column',
              sm: 'row'
            } }} display='flex' justifyContent='center' alignItems='center' height='calc(100vh - 200px)'>
            <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
            <Box display='flex' flexDirection='column' alignItems='center' >
                
                <Typography> Su carrito está vacio</Typography>
                <NextLink href='/' passHref>
                    <Link component={'span'} typography='h4' color='secondary'>
                        Regresar
                    </Link>
                </NextLink>
            </Box>
        </Box>
    </ShopLayout>
  )
}

export default EmptyPage