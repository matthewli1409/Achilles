const BFX = require('bitfinex-api-node')
const bfxRest = new BFX()
const rest2 = bfxRest.rest(2, {
    apiKey: 'O1DcY9ZhXDEAdzOxrCG2WVO2XkTfOU6oW5L1towW0Mg',
    apiSecret: 'hstq5BM6VhH866NEXv7VrcrEyJs7wIOL7iyPYLM6A63'
})

// const START = Date.now() - (30 * 24 * 60 * 60 * 1000 * 1000)
// const END = Date.now()
// rest2.accountTrades('tBTCUSD', START, END)
//     .then(trades => {
//         console.log(trades);
//     })


rest2.symbols().then(symbols => {
    console.log(symbols.map(e => `t${e.toUpperCase()}`));
}).catch(err => {
    debug('error: %j', err)
})


const bfx = new BFX({
    apiKey: '...',
    apiSecret: '...',
    ws: {
        autoReconnect: true,
        seqAudit: true,
        packetWDDelay: 10 * 1000,
    },

});
ws = bfx.ws()
subscribeTickers = ['BTCUSD', 'EOSUSD', 'ETHUSD', 'LTCUSD'];

const CANDLE_KEY = 'trade:1D:tBTCUSD'

ws.on('open', () => {
    console.log('open')
    ws.subscribeCandles(CANDLE_KEY)
})

let prevTS = null

ws.onCandle({
    key: CANDLE_KEY
}, (candles) => {

    try {
        console.log(new Date(candles[0][0]));
        console.log(new Date(candles[1][0]));
        console.log(new Date(candles[2][0]));


        console.log(candles[0])
        console.log(candles[1])
        console.log(candles[2])

    } catch (err) {
        console.error(err);
    }

})

ws.open();