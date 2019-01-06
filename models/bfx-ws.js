const BFX = require('bitfinex-api-node');
const soi = require('../util/socket');
const pnl = require('./pnl');

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

        this.subscribeTickers = ['BTCUSD', 'LTCUSD', 'LTCBTC', 'ETHUSD', 'ETHBTC', 'ETCBTC', 'ETCUSD', 'RRTUSD', 'RRTBTC', 'ZECUSD', 'ZECBTC', 'XMRUSD', 'XMRBTC', 'DSHUSD', 'DSHBTC', 'BTCEUR', 'BTCJPY', 'XRPUSD', 'XRPBTC', 'IOTUSD', 'IOTBTC', 'IOTETH', 'EOSUSD']
        // 'EOSBTC', 'EOSETH', 'SANUSD', 'SANBTC', 'SANETH', 'OMGUSD', 'OMGBTC', 'OMGETH', 'NEOUSD', 'NEOBTC', 'NEOETH', 'ETPUSD', 'ETPBTC', 'ETPETH', 'QTMUSD', 'QTMBTC', 'QTMETH', 'AVTUSD', 'AVTBTC', 'AVTETH', 'EDOUSD', 'EDOBTC', 'EDOETH', 'BTGUSD', 'BTGBTC', 'DATUSD', 'DATBTC', 'DATETH', 'QSHUSD', 'QSHBTC', 'QSHETH', 'YYWUSD', 'YYWBTC', 'YYWETH', 'GNTUSD', 'GNTBTC', 'GNTETH', 'SNTUSD', 'SNTBTC', 'SNTETH', 'IOTEUR', 'BATUSD', 'BATBTC', 'BATETH', 'MNAUSD', 'MNABTC', 'MNAETH', 'FUNUSD', 'FUNBTC', 'FUNETH', 'ZRXUSD', 'ZRXBTC', 'ZRXETH', 'TNBUSD', 'TNBBTC', 'TNBETH', 'SPKUSD', 'SPKBTC', 'SPKETH', 'TRXUSD', 'TRXBTC', 'TRXETH', 'RCNUSD', 'RCNBTC', 'RCNETH', 'RLCUSD', 'RLCBTC', 'RLCETH', 'AIDUSD', 'AIDBTC', 'AIDETH', 'SNGUSD', 'SNGBTC', 'SNGETH', 'REPUSD', 'REPBTC', 'REPETH', 'ELFUSD', 'ELFBTC', 'ELFETH', 'BTCGBP', 'ETHEUR', 'ETHJPY', 'ETHGBP', 'NEOEUR', 'NEOJPY', 'NEOGBP', 'EOSEUR', 'EOSJPY', 'EOSGBP', 'IOTJPY', 'IOTGBP', 'IOSUSD', 'IOSBTC', 'IOSETH', 'AIOUSD', 'AIOBTC', 'AIOETH', 'REQUSD', 'REQBTC', 'REQETH', 'RDNUSD', 'RDNBTC', 'RDNETH', 'LRCUSD', 'LRCBTC', 'LRCETH', 'WAXUSD', 'WAXBTC', 'WAXETH', 'DAIUSD', 'DAIBTC', 'DAIETH', 'CFIUSD', 'CFIBTC', 'CFIETH', 'AGIUSD', 'AGIBTC', 'AGIETH', 'BFTUSD', 'BFTBTC', 'BFTETH', 'MTNUSD', 'MTNBTC', 'MTNETH', 'ODEUSD', 'ODEBTC', 'ODEETH', 'ANTUSD', 'ANTBTC', 'ANTETH', 'DTHUSD', 'DTHBTC', 'DTHETH', 'MITUSD', 'MITBTC', 'MITETH', 'STJUSD', 'STJBTC', 'STJETH', 'XLMUSD', 'XLMEUR', 'XLMJPY', 'XLMGBP', 'XLMBTC', 'XLMETH', 'XVGUSD', 'XVGEUR', 'XVGJPY', 'XVGGBP', 'XVGBTC', 'XVGETH', 'BCIUSD', 'BCIBTC', 'MKRUSD', 'MKRBTC', 'MKRETH', 'KNCUSD', 'KNCBTC', 'KNCETH', 'POAUSD', 'POABTC', 'POAETH', 'LYMUSD', 'LYMBTC', 'LYMETH', 'UTKUSD', 'UTKBTC', 'UTKETH', 'VEEUSD', 'VEEBTC', 'VEEETH', 'DADUSD', 'DADBTC', 'DADETH', 'ORSUSD', 'ORSBTC', 'ORSETH', 'AUCUSD', 'AUCBTC', 'AUCETH', 'POYUSD', 'POYBTC', 'POYETH', 'FSNUSD', 'FSNBTC', 'FSNETH', 'CBTUSD', 'CBTBTC', 'CBTETH', 'ZCNUSD', 'ZCNBTC', 'ZCNETH', 'SENUSD', 'SENBTC', 'SENETH', 'NCAUSD', 'NCABTC', 'NCAETH', 'CNDUSD', 'CNDBTC', 'CNDETH', 'CTXUSD', 'CTXBTC', 'CTXETH', 'PAIUSD', 'PAIBTC', 'SEEUSD', 'SEEBTC', 'SEEETH', 'ESSUSD', 'ESSBTC', 'ESSETH', 'ATMUSD', 'ATMBTC', 'ATMETH', 'HOTUSD', 'HOTBTC', 'HOTETH', 'DTAUSD', 'DTABTC', 'DTAETH', 'IQXUSD', 'IQXBTC', 'IQXEOS', 'WPRUSD', 'WPRBTC', 'WPRETH', 'ZILUSD', 'ZILBTC', 'ZILETH', 'BNTUSD', 'BNTBTC', 'BNTETH', 'ABSUSD', 'ABSETH', 'XRAUSD', 'XRAETH', 'MANUSD', 'MANETH', 'BBNUSD', 'BBNETH', 'NIOUSD', 'NIOETH', 'DGXUSD', 'DGXETH', 'VETUSD', 'VETBTC', 'VETETH', 'UTNUSD', 'UTNETH', 'TKNUSD', 'TKNETH', 'GOTUSD', 'GOTEUR', 'GOTETH', 'XTZUSD', 'XTZBTC', 'CNNUSD', 'CNNETH', 'BOXUSD', 'BOXETH', 'TRXEUR', 'TRXGBP', 'TRXJPY', 'MGOUSD', 'MGOETH', 'RTEUSD', 'RTEETH', 'YGGUSD', 'YGGETH', 'MLNUSD', 'MLNETH', 'WTCUSD', 'WTCETH', 'CSXUSD', 'CSXETH', 'OMNUSD', 'OMNBTC', 'INTUSD', 'INTETH', 'DRNUSD', 'DRNETH', 'PNKUSD', 'PNKETH', 'DGBUSD', 'DGBBTC', 'BSVUSD', 'BSVBTC', 'BABUSD', 'BABBTC', 'WLOUSD', 'WLOXLM', 'VLDUSD', 'VLDETH', 'ENJUSD', 'ENJETH', 'ONLUSD', 'ONLETH', 'RBTUSD', 'RBTBTC', 'USTUSD', 'EUTEUR', 'EUTUSD', 'GSDUSD', 'UDCUSD', 'TSDUSD', 'PAXUSD', ];

    }

    startSocket() {

        this.ws.on('error', err => console.log(err))
        this.ws.on('open', () => {
            for (let i = 0; i < this.subscribeTickers.length; i++) {
                this.ws.subscribeTrades(this.subscribeTickers[i]);
            }
        });

        let tickers = this.subscribeTickers.map(e => 't' + e);
        tickers.forEach(ticker => {
            this.ws.onTrades({
                symbol: ticker
            }, (trades) => {
                pnl.processPrice(trades, ticker);
            });
        });

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