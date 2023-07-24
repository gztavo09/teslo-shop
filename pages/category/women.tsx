import { ShopLayout } from '@/components/layouts';
import { ProductList } from '@/components/products';
import { FullScreenLoading } from '@/components/ui';
import { useProducts } from '@/hooks';
import Typography from '@mui/material/Typography'

export default function CategoryWomenPage() {

  const { products, isError, isLoading } = useProducts('products?gender=women')
  
  if (isError) return <div>failed to load</div>

  console.log({ products });
  

  return (
    <ShopLayout title='Tesl-shop - Mujer' pageDescription='Encuentra los mejores productos para mujer en Teslo'>
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