import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material'
import NextLink from 'next/link'
import { ItemCounter } from '../ui'
import { FC, useContext } from 'react'
import { CartContext } from '@/context'
import { ICartProduct, IOrderItem } from '@/interfaces'

interface Props {
    editable?: boolean
    products?: IOrderItem[]
}

export const CartList: FC<Props> = ({ editable = false, products }) => {

    const { cart: productsInCart, updateCartQuantity, deleteProductInCart } = useContext(CartContext)

    const onNewCartQuantityValue = (product: ICartProduct, newQuantityValue: number) => {
        product.quantity = newQuantityValue
        updateCartQuantity(product)
    }

    const productsToShow = products ? products : productsInCart

  return (
    <>
        {
            productsToShow.map((product) => (
                <Grid container key={product.slug + product.size} spacing={2} sx={{
                    mb: 1
                }}>
                    <Grid item xs={3}>
                        <NextLink href={`/product/${product.slug}`} passHref>
                            <Link component={'span'} >
                                <CardActionArea>
                                    <CardMedia
                                        image={ `/products/${product.image}` }
                                        component='img'
                                        sx={{ borderRadius: '5px' }} 
                                    />
                                </CardActionArea>
                            </Link>
                        </NextLink>
                    </Grid>
                    <Grid item xs={7}>
                        <Box display='flex' flexDirection='column'>
                            <Typography variant='body1'>{ product.title }</Typography>
                            <Typography variant='body1'>Talla: <strong>{ product.size }</strong></Typography>
                            {
                                editable
                                ? <ItemCounter
                                    updatedQuantity={(value) => onNewCartQuantityValue(product as ICartProduct, value)}
                                    inStock={ 10 } 
                                    currentQuantity={product.quantity} 
                                    />
                                : <Typography variant='h6'>{product.quantity} Producto(s)</Typography>
                            }
                            
                        </Box>
                    </Grid>
                    <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                        <Typography variant='subtitle1'>${ product.price * product.quantity }</Typography>
                        {
                            editable && (
                            <Button onClick={() => deleteProductInCart(product as ICartProduct)} variant='text' color='secondary'>
                                Remover
                            </Button>)
                        }
                    </Grid>
                </Grid>
            ))
        }
    </>
  )
}
