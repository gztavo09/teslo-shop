export interface DashBoardSummaryResponse {
    numberOfOrders:         number
    paidOrders:             number
    numberOfClients:        number
    numberOfProducts:       number
    producsWithNoInventory: number
    lowInventory:           number
    notPaidOrders:           number
}