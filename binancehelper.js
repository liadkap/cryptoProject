import Binance from 'node-binance-api';

const APIKEY = 'GfneZVevOmuWaGXz0U1lDnuZxUsmIphF55bhBSF9Do0oaAuelXe3hRuiZPGr9Onq';
const APISECRET = 'CzYIUpJHaW75LSrZfuSV6rbte4H9s1Wz3EVsRhjq8csXqXH9F6K9c7XaV0sSCcct';

const binance = new Binance().options({
    APIKEY: APIKEY,
    APISECRET: APISECRET
});

export const createOrders = async orders => await binance.futuresMultipleOrders(orders)
export const getOrderStatus = async (symbol, orderID) => await binance.futuresOrderStatus(symbol, { orderId: orderID })