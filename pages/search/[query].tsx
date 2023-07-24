import { ShopLayout } from '@/components/layouts';
import { ProductList } from '@/components/products';
import { dbProducts } from '@/database';
import { IProduct } from '@/interfaces';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography'
import { GetServerSideProps, NextPage } from 'next';

interface Props {
  products: IProduct[],
  foundProducts: boolean,
  query: string
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
  
  return (
    <ShopLayout title='Tesl-shop - Search' pageDescription='Encuentra los mejores productos de Teslo aquí'>
      <Typography variant='h1' component='h1'>Buscar producto</Typography>
      
      {
        foundProducts
          ? <Typography variant='h2' sx={{ mb: 3}}>{ query }</Typography>
          : (
            <Box display='flex'>
              <Typography variant='h2' sx={{ mb: 3}}>No encontramos ningun producto</Typography>
              <Typography variant='h2' sx={{ mb: 2, ml: 1}} fontWeight={700} color='secondary'>{ query }</Typography>
            </Box>
          )
      }

      <ProductList products={products} />
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = '' } = params as { query: string }

  if(query.length === 0) {
    return {
        redirect: {
            destination: '/',
            permanent: true
        }
    }
  }

  let products = await dbProducts.getProductsByTerm(query)
  let foundProducts = products.length !== 0

  if(!foundProducts) {
    products = await dbProducts.getAllProducts()
  }

  return {
    props:{
      products,
      foundProducts,
      query
    }
  }
}

export default SearchPage