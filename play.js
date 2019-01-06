var DataFrame = require('pandas-js').DataFrame;
var Series = require('pandas-js').Series;

const db = require('./util/database');

// Get Trades from MongoDB
db.mongoConnect(() => {
    db.getDb().collection('Trade').find({
        Fund_ID: '0003'
    }).toArray((err, result) => {
        if (err) console.error(err);
        let df = new DataFrame(result);

        // Make fees absolute
        df = df.set('Fee', df.get('Fee').abs());

        // Adjusted Qty column
        let dfQtyUsd = new Series(df.get('Fee_Currency').where('USD', (v1, v2) => v1 === v2).values).mul(df.get('Quantity'));
        let dfQtyNonUsd = new Series(df.get('Fee_Currency').where('USD', (v1, v2) => v1 !== v2).values).mul(df.get('Quantity').sub(df.get('Fee')));
        let dfAdjQty = dfQtyUsd.add(dfQtyNonUsd);

        // Adjusted Fees column
        let dfFeeUsd = new Series(df.get('Fee_Currency').where('USD', (v1, v2) => v1 === v2).values).mul(df.get('Fee'));
        let dfFeeNonUsd = new Series(df.get('Fee_Currency').where('USD', (v1, v2) => v1 !== v2).values).mul(df.get('Fee').mul(0));
        let dfAdjFee = dfFeeUsd.add(dfFeeNonUsd);

        // Concat Adjusted Qty, Fees and Net Notional to main DataFrame
        df = df.set('Adjusted_Qty', dfAdjQty);
        df = df.set('Adjusted_Fee', dfAdjFee);
        df = df.set('Net_Notional', df.get('Adjusted_Qty').mul(df.get('Price')).add(df.get('Adjusted_Fee')));

        // Get unique tickers traded into array
        let tickers = df.get('Ticker').unique().toArray();
        tickers.forEach(ticker => {
            let dfFilter = df.filter(df.get('Ticker').eq(ticker));

            let cnn = dfFilter.get('Net_Notional').cumsum();
            let rollingQty = dfFilter.get('Adjusted_Qty').cumsum();
            let openAve = cnn.div(rollingQty);

            dfFilter = dfFilter.set('Cum_Net_Notional', cnn);
            dfFilter = dfFilter.set('Rolling_Qty', rollingQty);
            dfFilter = dfFilter.set('Open_Average', openAve);
            console.log(dfFilter.tail(5).toString())

        });
    });
});