import { ShopLayout } from "@/components/layouts"
import { ProductSlideShow } from "@/components/products"
import { FullScreenLoading, ItemCounter, SizeSelector } from "@/components/ui"
import { dbProducts } from "@/database"
import { useProducts } from "@/hooks"
import { IProduct } from "@/interfaces"
import { Box, Button, Chip, Grid, Typography } from "@mui/material"
import { GetServerSideProps, GetStaticPaths, GetStaticProps, NextPage } from "next"
import { useRouter } from "next/router"

interface Props {
  product: IProduct
}

const ProductPage: NextPage<Props> = ({ product }) => {

  // const { query } = useRouter()
  // const { products: product, isLoading } = useProducts('/products/' + query.slug)
  
  // if(isLoading) return <FullScreenLoading />
  // if(!product) return <h1>No existe...</h1>
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
                  <ItemCounter />
                  <SizeSelector selectedSize={ product.sizes[0] } sizes={ product.sizes } />
                </Box>

                <Button color="secondary" className="circular-btn">
                  Agregar al carrito
                </Button>

                {/* <Chip label='No hay disponibles' color='error' variant='outlined' /> */}

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