const fs = require('fs');
const sql = require("mssql");
var DataFrame = require('pandas-js').DataFrame;
var Series = require('pandas-js').Series;

const pdHelper = require('./util/pandas');
const bDates = require('./util/benchmarkDates');


const db = require('./util/database');

// db.mongoConnect(() => {
//     db.getDb().collection('Trade').find({
//         Fund_ID: '0003'
//     }).toArray((err, result) => {
//         if(err) console.error(err);
//         let df = new DataFrame(result);
//         console.log(df.head(5).toString());
//     })
// });


// pool1 = db.connection.connect();

// pool1.then(() => {
//         var request = new sql.Request(db.connection);
//         return request.query("SELECT *, CAST(Date_Time AS DATE) AS Date FROM   Trade_table WITH (NOLOCK) WHERE  Fund_id = '0003'")
//     })
//     .then(result => {
//         // console.log(result.recordset);
//         let df = new DataFrame(result.recordset);
//         console.log('in');

//         df = df.transpose();

//         fs.writeFile('data/trades.json', JSON.stringify(df.to_json()), (err) => {
//             if (err) console.log(err);
//             console.log('Trades written');
//         })
//     });


pdHelper.pdReadJsonDf('data/trades.json', (err, df) => {

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

    // FILTER BY BTC AND STRATEGIC TRADES FOR NOW. WILL NEED TO LOOP OVER INSTRUMENTS IN DEPLOYMENT
    let dfFilter = df.filter(df.get('Ticker').eq('tBTCUSD'));
    // dfFilter = dfFilter.filter(dfFilter.get('Classification').eq('R'));

    let cnn = dfFilter.get('Net_Notional').cumsum();
    let rollingQty = dfFilter.get('Adjusted_Qty').cumsum();
    let openAve = cnn.div(rollingQty);

    // dfFilter = dfFilter.set('nn', dfnn);
    dfFilter = dfFilter.set('cnn', cnn);
    dfFilter = dfFilter.set('Rolling_Qty', rollingQty);
    dfFilter = dfFilter.set('Open_Average', openAve);

    pdHelper.dfToCsv(dfFilter, 'cnn');

    // Find dates greater than...
    ytdDt = new Date(2018, 11, 31);

    dfdt = dfFilter.get('Date');
    dfdt = dfdt.map((val, idx) => Date.parse(val));
    console.log(ytdDt);
    console.log(Date.parse(ytdDt))

    // IS IT GREATER THAN YTD DATE
    dfDtTrue = dfdt.gte(Date.parse(ytdDt));

    // If 0 then our current benchmark (YTD) date is greater than the last traded date
    let benchmarkGreaterBool = dfDtTrue.filter(dfDtTrue.eq(true)).length

    if (benchmarkGreaterBool === 0) {
        console.log('Last traded date is before YTD');

        // Get last row of data of trades as this is the last updated RollingQty
        dfFilterColumns = dfFilter.columns.toJS();
        let rollingQtyColIdx = dfFilterColumns.indexOf('Rolling_Qty');
        let openAveColIdx = dfFilterColumns.indexOf('Open_Average');

        let rollingQty = dfFilter.iloc(dfFilter.length-1, rollingQtyColIdx).values.toJS()[0][0];
        let openAve = dfFilter.iloc(dfFilter.length-1, openAveColIdx).values.toJS()[0][0];

        // That means we need to get the last traded - TODO GET THIS FROM API
        let ytdPrice = 3830.5;
        // let cumPnl = (ytdPrice - openAve) * rollingQty;
        let livePnl = ((4025.7 - openAve) * rollingQty) - ((ytdPrice - openAve) * rollingQty);
        console.log(livePnl);
        console.log(bDates.ytdBenchmarkDate(new Date()))
    }
})