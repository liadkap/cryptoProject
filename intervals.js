import { createOrders, getOrderStatus } from './binancehelper';
import Order from './order'

const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export default async () => {
    while (true) {
        try {
            await createStopLoss();
            //await updateStopLoss();
        } catch (error) {
            console.log(error);
        }

        await delay(1000)
    }
}

const createStopLoss = async () => {
    const openOrders = await Order.find({ status: 'NEW' });
    await Promise.all(openOrders.map(async x => {
        const { symbol, orderID, stopLoss, quantity } = x;
        const { status } = await getOrderStatus(symbol, orderID)
        if (status === "FILLED") {
            try {
                const result = await createOrders([{
                    symbol: symbol,
                    side: "SELL",
                    type: "STOP_MARKET",
                    quantity: quantity,
                    stopPrice: stopLoss[0],
                }])
                await updateOrderInDB(x, result[0].orderId, stopLoss[0])
            } catch (error) {
                console.log(error);
            }
        }
    }))
}

const updateOrderInDB = async (x, newOrderId, currentStopLoss) => {
    await x.update({
        status: 'FILLED',
        orderID: newOrderId,
        currentStopLoss
    })
}

const updateStopLoss = () => {
    console.log('update');
}