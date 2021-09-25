import express from 'express';
import axios from 'axios'
import { createHmac } from 'crypto'
import Binance from 'node-binance-api';

const APIKEY = 'GfneZVevOmuWaGXz0U1lDnuZxUsmIphF55bhBSF9Do0oaAuelXe3hRuiZPGr9Onq';
const APISECRET = 'CzYIUpJHaW75LSrZfuSV6rbte4H9s1Wz3EVsRhjq8csXqXH9F6K9c7XaV0sSCcct';

const binance = new Binance().options({
    APIKEY: APIKEY,
    APISECRET: APISECRET
});

var router = express.Router();

router.get('/', async (req, res) => {
    const timestamp = Date.now()
    const queryString = `timestamp=${timestamp}`

    const signature = createSignature(queryString);
    const signedQueryString = `timestamp=${timestamp}&signature=${signature}`

    try {
        const { data } = await axios.get(`https://fapi.binance.com/fapi/v2/balance?${signedQueryString}`, {
            headers: {
                'X-MBX-APIKEY': APIKEY
            }
        })
        res.send(data);
    } catch (error) {
        res.send(error);
    }
})

router.post('/stopmarket', async (req, res) => {

    const orders = [
        {
            symbol: "ETHUSDT",
            side: "BUY",
            type: "STOP_MARKET",
            quantity:"0.001",
            stopPrice: "3600",
        },
        {
            symbol: "ETHUSDT",
            side: "SELL",
            type: "STOP",
            quantity:"0.001",
            stopPrice: "2800",
            price: "2800",
        },
        {
            symbol: "ETHUSDT",
            side: "SELL",
            type: "TAKE_PROFIT",
            quantity:"0.001",
            stopPrice: "4000",
            price:"4000"
        }
    ]

    try {
        res.send(await binance.futuresMultipleOrders(orders))
    } catch (error) {
        console.log(error);
    }
    // const timestamp = Date.now()
    // const queryString = `symbol=ETHUSDT&side=BUY&type=MARKET&quantity=0.001&timestamp=${timestamp}`

    // const signature = createSignature(queryString);
    // const signedQueryString = `${queryString}&signature=${signature}`

    // console.log(signedQueryString);
    // try {
    //     const result = await axios.post(`https://fapi.binance.com/fapi/v1/order?${signedQueryString}`, {}, {
    //         headers: {
    //             'X-MBX-APIKEY': APIKEY
    //         }
    //     })
    //     res.send(result);
    // } catch (error) {
    //     res.send(error);
    // }
})

router.delete('/stop', async (req, res) => {
    const timestamp = Date.now()
    const queryString = `symbol=ETHUSDT&timestamp=${timestamp}`

    const signature = createSignature(queryString);
    const signedQueryString = `symbol=ETHUSDT&timestamp=${timestamp}&signature=${signature}`

    console.log(signedQueryString);
    try {
        await axios.delete(`https://fapi.binance.com/fapi/v1/allOpenOrders?${signedQueryString}`, {
            headers: {
                'X-MBX-APIKEY': APIKEY
            }
        })
        res.send(200);
    } catch (error) {
        console.log(error);
    }
})

const createSignature = (paramsString) => {
    const hash = createHmac('sha256', APISECRET)
        .update(paramsString)
        .digest('hex');
    console.log(hash);
    return hash;
}

export default router;