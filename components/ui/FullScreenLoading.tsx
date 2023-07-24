import { Box, CircularProgress, Typography } from '@mui/material'
import React from 'react'

export const FullScreenLoading = () => {
  return (
    <Box  sx={{ flexDirection: 'column' }} display='flex' justifyContent='center' alignItems='center'>
            <Typography fontWeight={ 200 } variant="h2" fontSize={20} sx={{ mb: 3 }}>Cargando...</Typography>
            <CircularProgress thickness={ 2 } />
    </Box>
  )
}
