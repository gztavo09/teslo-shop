import { Box, IconButton, Typography } from '@mui/material'
import React, { FC, useState } from 'react'
import { RemoveCircleOutline, AddCircleOutline } from '@mui/icons-material'

interface Props {
  currentQuantity: number,
  inStock: number,
  updatedQuantity: (value: number) => void
}

export const ItemCounter: FC<Props> = ({ currentQuantity, inStock, updatedQuantity }) => {

  const onUpdate = (value: number) => {
    updatedQuantity(value)
  }

  return (
    <Box display='flex' alignItems='center'>
        <IconButton
          disabled={ currentQuantity === 1 }
          onClick={ () => onUpdate(currentQuantity - 1) }
        >
            <RemoveCircleOutline />
        </IconButton>
        <Typography sx={{ width: 40, textAlign: 'center' }} >{ currentQuantity }</Typography>
        <IconButton
          onClick={ () => onUpdate(currentQuantity + 1) }
          disabled={ currentQuantity === inStock }
        >
            <AddCircleOutline />
        </IconButton>
    </Box>
  )
}
