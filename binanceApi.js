import express from 'express';
import Order from './order'
import { createOrders } from './binancehelper'


var router = express.Router();

router.get('/', async (req, res) => {
    try {
        res.send(await binance.futuresAllOrders());
    } catch (error) {
        res.send(error);
    }
})

router.post('/', async ({ query: { symbol, takeProfit, quantity, startPrice, stopLoss } }, res) => {
    const orders = [
        {
            symbol: symbol,
            side: "BUY",
            type: "STOP_MARKET",
            quantity: quantity,
            stopPrice: startPrice,
        },
        {
            symbol: symbol,
            side: "SELL",
            type: "TAKE_PROFIT",
            quantity: quantity,
            stopPrice: takeProfit,
            price: takeProfit
        }
    ]

    try {
        const result = await createOrders(orders)
        const order = new Order({
            orderID: result[0].orderId,
            takeProfitOrderID: result[1].orderId,
            status: result[0].status,
            startPrice: startPrice,
            takeProfitPrice: takeProfit,
            quantity: quantity,
            symbol: symbol,
            stopLoss: stopLoss,
            startTime: new Date()
        })
        
        await order.save()
        res.send(result)
    } catch (error) {
        res.send(result);
    }
})

router.delete('/', async ({ query: { id } }, res) => {
    try {
        await cancelOrder(id)
        res.send(200);
    } catch (error) {
        res.send(error);
    }
})

const cancelOrder = async id => {
    const { orderID, takeProfitOrderID, symbol } = await Order.findOne({ orderID: id });
    const result = await Promise.all(binance.futuresCancel(symbol, { orderId: orderID }), binance.futuresCancel(symbol, { orderId: takeProfitOrderID }))
}

export default router;