import { CartContext, UIContext } from "@/context"
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material"
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from "@mui/material"
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from "next/router"
import { useContext, useState } from "react"

export const Navbar = () => {
  const router = useRouter()

  const { numberOfItems } = useContext(CartContext)
  const { toggleSideMenu } = useContext(UIContext)

  const [searchTerm, setSearchTerm] = useState("")
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const onSearchTerm = () => {
      if(searchTerm.trim().length === 0) return 
      router.push(`/search/${ searchTerm }`)
  }

  const pathname = usePathname()

  return (
    <AppBar>
        <Toolbar>
            <NextLink href='/' passHref>
                <Link display='flex' alignItems='center' component={'span'}>
                    <Typography variant='h6'>Teslo |</Typography>
                    <Typography sx={{ ml: 0.6 }} >Shop</Typography>
                </Link>
            </NextLink>

            <Box flex={ 1 }></Box>

            <Box sx={{ display: {
              xs: 'none',
              sm: 'block'
            } }}>
              <NextLink href='/category/men' passHref>
                <Link component={'span'}>
                  <Button color={ pathname == '/category/men' ? 'primary' : 'info' }>Hombres</Button>
                </Link>
              </NextLink>
              <NextLink href='/category/women' passHref>
                <Link component={'span'}>
                  <Button color={ pathname == '/category/women' ? 'primary' : 'info' }>Mujeres</Button>
                </Link>
              </NextLink>
              <NextLink href='/category/kid' passHref>
                <Link component={'span'}>
                  <Button color={ pathname == '/category/kid' ? 'primary' : 'info' }>Niños</Button>
                </Link>
              </NextLink>
            </Box>

            <Box flex={ 1 }></Box>

            {
              isSearchVisible
              ? (
                <Input
                  sx={{ display: { xs: 'none', sm: 'flex' }}}
                  className="fadeIn"
                  autoFocus
                  value={ searchTerm }
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={ (e) => e.key === 'Enter' ? onSearchTerm() : null }
                  type='text'
                  placeholder="Buscar..."
                  endAdornment={
                      <InputAdornment position="end">
                          <IconButton
                              onClick={() => setIsSearchVisible(false)}
                          >
                            <ClearOutlined />
                          </IconButton>
                      </InputAdornment>
                  }
                />
              )
              : (
                <IconButton
                  onClick={() => setIsSearchVisible(true)}
                  className="fadeIn"
                  sx={{ display: { xs: 'none', sm: 'flex' }}}
                >
                  <SearchOutlined />
                </IconButton>
              )
            }

            

            <IconButton
              sx={{ display: { xs: 'flex', sm: 'none' }}}
              onClick={() => toggleSideMenu()}
            >
              <SearchOutlined />
            </IconButton>

            <NextLink href='/cart' passHref>
              <Link component={'span'}>
                <IconButton>
                  <Badge color="primary" badgeContent={ numberOfItems > 9 ? '+9': numberOfItems }>
                    <ShoppingCartOutlined />
                  </Badge>
                </IconButton>
              </Link>
            </NextLink>

            <Button onClick={() => toggleSideMenu()}>
              Menú
            </Button>
        </Toolbar>
    </AppBar>
  )
}
