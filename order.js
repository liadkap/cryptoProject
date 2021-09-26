import mongoose from 'mongoose'

export default mongoose.model('order',
    {
        orderID: String,
        takeProfitOrderID: String,
        status: String,
        symbol: String,
        startPrice: Number,
        takeProfitPrice: Number,
        quantity: String,
        stopLoss: [String],
        currentStopLoss: Number,
        startTime: Date
    }
);
