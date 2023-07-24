import { ISize } from "@/interfaces"
import { Box, Button } from "@mui/material"
import { FC } from "react"

interface Props {
    selectedSize?: ISize,
    sizes: ISize[],
    onSelectedSize: (value: ISize) => void
}

export const SizeSelector: FC<Props> = ({ selectedSize, sizes, onSelectedSize }) => {
  return (
    <Box>
        {
            sizes.map(size => (
                <Button key={size}
                    color={ selectedSize === size ? 'primary' : 'info' }
                    size="small"
                    onClick={() => onSelectedSize(size)}
                >{ size }</Button>
            ))
        }
    </Box>
  )
}
