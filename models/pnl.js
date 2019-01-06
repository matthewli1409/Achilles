let ytdPrice = 3830.5;
let openAve = 5593.737852;
let rollingQty = 25;
const db = require('../util/database');
const soi = require('../util/socket');
const benchmark = require('../util/benchmarkDates');

// Get initial benchmark dates for PnL calcs.
let staleDtdBenchmarkDate = benchmark.dtdBenchmarkDate(new Date(2019, 0, 4));
let staleMtdBenchmarkDate = benchmark.mtdBenchmarkDate(new Date());
let staleYtdBenchmarkDate = benchmark.ytdBenchmarkDate(new Date());
let dtdBenchmarkPrices, mtdBenchmarkPrices, ytdBenchmarkPrices;

setInitialPriceArray = () => {
    setDtdBenchmarkPrices(staleDtdBenchmarkDate);
    setMtdBenchmarkPrices(staleMtdBenchmarkDate);
    setYtdBenchmarkPrices(staleYtdBenchmarkDate);
};

setDtdBenchmarkPrices = (date) => {
    getPricesFromDb(date, (result) => {
        dtdBenchmarkPrices = result;
    });
};

setMtdBenchmarkPrices = (date) => {
    getPricesFromDb(date, (result) => {
        mtdBenchmarkPrices = result;
    });
};

setYtdBenchmarkPrices = (date) => {
    getPricesFromDb(date, (result) => {
        ytdBenchmarkPrices = result;
    });
};

getPricesFromDb = (date, next) => {
    db.getDb().collection('Price').find({
        Date_Time: date.toDate()
    }).toArray((err, result) => {
        if (err) console.error(err);
        next(result);
    });
}

processPrice = (trades, inst) => {
    console.log(`${inst}: ${trades[0][3]}`);

    let livePrice = trades[0][3];

    if (inst === 'tBTCUSD') {
        let livePnl = ((livePrice - openAve) * rollingQty) - ((ytdPrice - openAve) * rollingQty);
        soi.io().emit('chat', {
            message: parseFloat(trades[0][3]).toFixed(2),
            instrument: inst,
            PnlYtd: parseFloat(livePnl).toFixed(2)
        });
    } else {
        soi.io().emit('chat', {
            message: parseFloat(trades[0][3]).toFixed(2),
            instrument: inst
        });
    }
};

// Refresh Benchmark Dates (DTD, MTD, YTD) every minute
// i.e. if current date is 14/09/2019, DTD benchmark date will be 13/09/2019
setInterval(() => {
    console.log('Refreshing Benchmark Dates...');
    dtdBenchmarkDate = benchmark.dtdBenchmarkDate(new Date());
    mtdBenchmarkDate = benchmark.mtdBenchmarkDate(new Date());
    ytdBenchmarkDate = benchmark.ytdBenchmarkDate(new Date());

    if (dtdBenchmarkDate.isAfter(staleDtdBenchmarkDate)) {
        setDtdBenchmarkPrices(dtdBenchmarkDate);
        staleDtdBenchmarkDate = dtdBenchmarkPrices;
    }
    if (mtdBenchmarkDate.isAfter(staleMtdBenchmarkDate)) {
        setMtdBenchmarkPrices(mtdBenchmarkDate);
        staleMtdBenchmarkDate = mtdBenchmarkPrices;
    }
    if (ytdBenchmarkDate.isAfter(staleYtdBenchmarkDate)) {
        setYtdBenchmarkPrices(ytdBenchmarkDate);
        staleYtdBenchmarkDate = ytdBenchmarkPrices;
    }
}, 60 * 100);

exports.processPrice = processPrice;
exports.setInitialPriceArray = setInitialPriceArray;