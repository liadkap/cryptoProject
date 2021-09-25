import express from 'express'
import binance from './binanceApi'

const app = express();

app.use('/', binance);

app.listen(1212, () => {
    console.log(`Example app listening at http://localhost:${1212}`)
})

