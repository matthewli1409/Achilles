const BFX = require('bitfinex-api-node');
const soi = require('../util/socket');

class BFXws {
    constructor() {
        const bfx = new BFX({
            apiKey: '...',
            apiSecret: '...',
            ws: {
                autoReconnect: true,
                seqAudit: true,
                packetWDDelay: 10 * 1000,               
            },

        });
        this.ws = bfx.ws()
        this.subscribeTickers = ['BTCUSD', 'EOSUSD', 'ETHUSD', 'LTCUSD'];
    }

    startSocket() {

        this.ws.on('error', err => console.log(err))
        this.ws.on('open', () => {
            for (var i = 0; i < this.subscribeTickers.length; i++) {
                this.ws.subscribeTrades(this.subscribeTickers[i]);
            }
        });
    
        let tickers = this.subscribeTickers.map(e => 't' + e);
        tickers.forEach(ticker => {
            this.ws.onTrades({ symbol: ticker}, (trades) => {
                this.processPrice(trades, ticker)
            });
        });
        // tickers.forEach(ticker => {
        //     this.ws.onOrderBook({ symbol: ticker}, (ob) => {
        //         console.log(ob.bids);
        //         console.log(ob.midPrice());
        //         console.log(ob.asks);
        //         this.processPrice(ob.bids[0][0], ticker)
        //     });
        // });
    
        this.ws.open()
    };

    processPrice(trades, inst) {
        console.log(`${inst}: ${trades[0][3]}`);
        soi.io().emit('chat', {
            message: parseFloat(trades[0][3]),
            instrument: inst
        });
    };

}

exports.BFXws = BFXws;

// exports.bfxInit = () => {
//     const bfx = new BFX({
//         apiKey: '...',
//         apiSecret: '...',
//         ws: {
//             autoReconnect: true,
//             seqAudit: true,
//             packetWDDelay: 10 * 1000
//         }
//     });

//     const ws = bfx.ws()

//     subscribeTickers = ['BTCUSD', 'EOSUSD', 'ETHUSD', 'LTCUSD'];

//     ws.on('error', err => console.log(err))
//     ws.on('open', () => {
//         for (var i = 0; i < subscribeTickers.length; i++) {
//             ws.subscribeTrades(subscribeTickers[i]);
//         }
//     });

//     let tickers = subscribeTickers.map(e => 't' + e);
//     tickers.forEach(ticker => {
//         ws.onTrades({
//             symbol: ticker
//         }, (trades) => {
//             processPrice(trades, ticker)
//         });
//     });

//     ws.open()
// }

// function processPrice(trades, inst) {
//     console.log(`${inst}: ${trades[0][3]}`);
//     soi.io().emit('chat', {
//         message: parseFloat(trades[0][3]),
//         instrument: inst
//     });
// }