import { UIContext } from "@/context"
import { SearchOutlined } from "@mui/icons-material"
import { AppBar, Box, Button, IconButton, Link, Toolbar, Typography } from "@mui/material"
import NextLink from 'next/link'
import { useContext } from "react"

export const AdminNavbar = () => {
  const { toggleSideMenu } = useContext(UIContext)

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
            <IconButton
              sx={{ display: { xs: 'flex', sm: 'none' }}}
              onClick={() => toggleSideMenu()}
            >
              <SearchOutlined />
            </IconButton>

            <Box flex={1} />

            <Button onClick={() => toggleSideMenu()}>
              Menú
            </Button>
        </Toolbar>
    </AppBar>
  )
}
