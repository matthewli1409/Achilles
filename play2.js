const fs = require('fs');
const sql = require("mssql");
var DataFrame = require('pandas-js').DataFrame;
var Series = require('pandas-js').Series;

const pdHelper = require('./util/pandas');

const {
    Map
} = require('immutable');
const {
    convertArrayToCSV
} = require('convert-array-to-csv');

const db = require('./util/database');

pool1 = db.connection.connect();

// pool1.then(() => {
//         var request = new sql.Request(db.connection);
//         return request.query("SELECT * FROM Trade_Table WHERE Fund_ID = '0003'")
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


//         console.log(df.head(2).toString());

//         // let a = df.get('Ticker').map(e => e.slice(1, 4)).values

//         t0 = new Date().getTime();

//         // Qty if fees are in USD
//         let dfQtyUsd = new Series(df.get('Fee_Currency').where('USD', (v1, v2) => v1 === v2).values).mul(df.get('Quantity'));

//         // QTY if fees are in coin
//         let dfQtyNonUsd = new Series(df.get('Fee_Currency').where('USD', (v1, v2) => v1 !== v2).values).mul(df.get('Quantity').sub(df.get('Fee').abs()));

//         // NET Qty
//         let dfQty = dfQtyUsd.add(dfQtyNonUsd);

//         // QTY * PRICE + Fees
//         let nn = dfQty.mul(df.get('Price')).add(dfQtyUsd)

//         console.log(nn.values.toJS());
//         // APPEND NET QTY TO THE END OF df
//         df = new DataFrame(([nn.values.toJS(), df])).transpose();

//         // FILTER BY BTC AND STRATEGIC TRADES FOR NOW. WILL NEED TO LOOP OVER INSTRUMENTS IN DEPLOYMENT
//         // let dfFilter = df.filter(df.get('Ticker').eq('tBTCUSD'));
//         // dfFilter = dfFilter.filter(dfFilter.get('Classification').eq('S'));

//         // console.log(dfFilter.values.toString());
//         // console.log(dfFilter.length)

//         // let dfStratFilter = new Series(df.get('Classification').where('S', (v1, v2) => v1 === v2).values)

//         // let dfInstFilter = new Series(df.get('Ticker').where('tBTCUSD', (v1, v2) => v1 === v2).values).mul(dfStratFilter).mul(nn);

//         // console.log(dfInstFilter)
//         // console.log(dfInstFilter.length);

//         // console.log(df)
//         let cnn = dfInstFilter.cumsum();
//         // console.log(cnn);
//         // console.log(cnn.length);

//         console.log(dfStratFilter.filter(dfStratFilter.eq(true)).values);
//         // console.log(dfStratFilter);


//         // serToCsv(, 'cnn');

//         console.log(new Date().getTime() - t0);
//     })
//     .catch(err => {
//         console.log(err);
//     });


pdHelper.pdReadJsonDf('data/trades.json', (err, df) => {
    // Qty if fees are in USD
    let dfQtyUsd = new Series(df.get('Fee_Currency').where('USD', (v1, v2) => v1 === v2).values).mul(df.get('Quantity'));

    // QTY if fees are in coin
    let dfQtyNonUsd = new Series(df.get('Fee_Currency').where('USD', (v1, v2) => v1 !== v2).values).mul(df.get('Quantity').sub(df.get('Fee').abs()));

    // NET Qty
    let dfQty = dfQtyUsd.add(dfQtyNonUsd);

    // QTY * PRICE + Fees
    let nn = dfQty.mul(df.get('Price')).add(dfQtyUsd)

    // Add Net Qty to main DataFrame
    df = df.set('Net_Qty', dfQty);
    console.log(df.tail(5).toString());

    fs.writeFile('data/trades.csv', df.to_csv(), err => {
        console.log('done');
    });

    // pdHelper.seriesToCsv(dfQty, 'Qty')


});