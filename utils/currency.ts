export const format = (value: number) => {
    const formatter = new Intl.NumberFormat('pe-PE', {
        style: 'currency',
        currency: 'SOL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })

    return formatter.format(value)
}