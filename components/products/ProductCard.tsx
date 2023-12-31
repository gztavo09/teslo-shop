import { IProduct } from '@/interfaces'
import NextLink from 'next/link'
import { Box, Card, CardActionArea, CardMedia, Grid, Typography, Link, Chip } from '@mui/material'
import React, { FC, useMemo, useState } from 'react'

interface Props {
    product: IProduct
}

export const ProductCard: FC<Props> = ({ product }) => {

    const [isHovered, setIsHovered] = useState(false)
    const [ isImageLoader, setIsImageLoader ] = useState(false)

    const productImage = useMemo(() => {
        return isHovered ? `/products/${product.images[1]}` : `/products/${product.images[0]}`
    }, [isHovered])

    return (
        <Grid item xs={6} sm={4}
            onMouseEnter={ () => setIsHovered(true) }
            onMouseLeave={ () => setIsHovered(false) }
        >
            <Card>
                <NextLink href={`/product/${product.slug}`} passHref prefetch={false}>
                    <Link component={'span'}>
                        {
                            product.inStock === 0 && (
                                <Chip
                                    color='primary'
                                    label='No hay disponibles'
                                    sx={{ position: 'absolute', zIndex: 99, top: '10px', left:'10px' }}
                                />
                            )
                        }
                        
                        <CardActionArea>
                            <CardMedia 
                            component='img'
                            className='fadeIn'
                            image={ productImage }
                            alt={ product.title }
                            onLoad={() => setIsImageLoader(true)}
                            />
                        </CardActionArea>
                    </Link>
                </NextLink>
                
            </Card>
            <Box sx={{ mt: 1, display: isImageLoader ? 'block' : 'none' }} className='fadeIn'>
                <Typography fontWeight={700}>{ product.title }</Typography>
                <Typography fontWeight={500} >${ product.price }</Typography>
            </Box>
        </Grid>
    )
}
