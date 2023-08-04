import { ShopLayout } from '@/components/layouts';
import { ProductList } from '@/components/products';
import { FullScreenLoading } from '@/components/ui';
import { useProducts } from '@/hooks';
import Typography from '@mui/material/Typography'
import { useSession } from 'next-auth/react';

export default function Home() {
  const session = useSession()

  const { products, isError, isLoading } = useProducts('products')
  
  if (isError) return <div>failed to load</div>

  return (
    <ShopLayout title='Tesl-shop - Home' pageDescription='Encuentra los mejores productos de Teslo aquí'>
      <Typography variant='h1' component='h1'>Tienda</Typography>
      <Typography variant='h2' sx={{ mb: 1}}>Tienda</Typography>
      {
        isLoading
          ? <FullScreenLoading />
          : <ProductList products={products} />
      }
    </ShopLayout>
  )
}
