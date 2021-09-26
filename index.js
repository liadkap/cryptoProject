import express from 'express'
import binance from './binanceApi'
import mongoose from 'mongoose';
import backgroundTask from './intervals'

const app = express();

app.use('/', binance);

mongoose.connect('mongodb://localhost:27017/crypto')
    .then(() => app.listen(1212, () => {
        console.log(`Example app listening at http://localhost:${1212}`)
    })).catch(console.log)

backgroundTask()
