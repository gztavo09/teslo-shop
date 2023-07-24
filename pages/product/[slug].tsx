import { ShopLayout } from "@/components/layouts"
import { ProductSlideShow } from "@/components/products"
import { ItemCounter, SizeSelector } from "@/components/ui"
import { CartContext } from "@/context"
import { dbProducts } from "@/database"
import { IProduct, ICartProduct, ISize } from "@/interfaces"
import { Box, Button, Chip, Grid, Typography } from "@mui/material"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { useRouter } from "next/router"
import { useContext, useState } from "react"

interface Props {
  product: IProduct
}

const ProductPage: NextPage<Props> = ({ product }) => {

  const { addProductToCart } = useContext(CartContext)
  const router = useRouter()

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    inStock: product.inStock,
    quantity: 1
  })

  const selectedSize = (value: ISize) => {
    setTempCartProduct({
      ...tempCartProduct,
      size: value
    })
  }

  const updatedQuantity = (value: number) => {
    setTempCartProduct({
      ...tempCartProduct,
      quantity: value,
    })
  }

  const onAddToCart = () => {
    addProductToCart(tempCartProduct)
    router.push('/cart')
  }

  return (
      <ShopLayout title={ product.title } pageDescription={ product.description }>
        {
          <Grid container spacing={3}>
            <Grid item xs={12} sm={7}>
              <ProductSlideShow images={product.images} />
            </Grid>
            <Grid item xs={12} sm={5}>
              <Box display='flex' flexDirection='column'>
                <Typography variant='h1' component='h1'>
                  { product.title }
                </Typography>
                <Typography variant='subtitle1' component='h2'>
                  ${ product.price.toFixed(2) }
                </Typography>

                <Box sx={{ my: 2 }}>
                  <Typography variant="subtitle2">Cantidad</Typography>
                  <ItemCounter 
                    currentQuantity={ tempCartProduct.quantity }
                    updatedQuantity={ updatedQuantity }
                    inStock={ tempCartProduct.inStock }
                  />
                  <SizeSelector 
                    selectedSize={ tempCartProduct.size } 
                    sizes={ product.sizes } 
                    onSelectedSize={ selectedSize }
                  />
                </Box>

                

                {
                  product.inStock === 0 
                  ? <Chip label='No hay disponibles' color='error' variant='outlined' />
                  : (<Button disabled={ !tempCartProduct.size } onClick={() => onAddToCart() } color="secondary" className="circular-btn">
                    {
                      tempCartProduct.size
                        ? 'Agregar al carrito'
                        : 'Seleccione una talla'
                    }
                    
                  </Button>)
                }
                

                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2">Descripción</Typography>
                  <Typography variant="body2">{ product.description }</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item >

            </Grid>
          </Grid>
        }
      </ShopLayout>
  )
}


//* OPCION 2 PARA GENERAR LA PAGINA DESDE EL SERVIDOR
// export const getServerSideProps: GetServerSideProps = async({ params }) => {
//   const { slug } = params as { slug: string }

//   const product = await dbProducts.getProductyBySlug(slug)

//   if(!product) {
//       return {
//           redirect: {
//               destination: '/',
//               permanent: false
//           }
//       }
//   }


//   return {
//       props: {
//           product
//       }
//   }
// }

// OPCION 3 GENERAR TODAS LAS PAGINAS ESTATICAS
export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const response = await dbProducts.getAllProductSlugs();
  const products = response.map( ( value, index ) => value.slug );

  return {
    paths: products.map(slug => ({
      params: { slug }
    })),
    // fallback: false
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };
  const product = await dbProducts.getProductyBySlug(slug)

  if ( !product ) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      product
    },
    revalidate: 86400, // 60 * 60 * 24,
  }
}

export default ProductPage