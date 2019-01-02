const DataFrame = require('pandas-js').DataFrame;
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

/**
 * Convert JSON to DataFrame object
 * Returns DataFrame
 *
 * @param {String} pathToJsonData path to the JSON data to be inserted into DataFrame.
 * @param {Function} next callback
 * @public
 */
const pdReadJsonDf = (pathToJsonData, next) => {
    console.log(pathToJsonData);
    fs.readFile(pathToJsonData, (err, data) => {
        if (err) next(err);

        // Data from df.to_json() usually comes in as "1": {col1 : value, col2 : value}. Therefore extract the values only
        data = JSON.parse(data);
        var data = Object.keys(data).map(key => {
            return data[key];
        });
        next(err, new DataFrame(data));
    });
};

/**
 * Convert Series into csv via converting to JSON first
 *
 * @param {Series} series Series to be converted to csv.
 * @param {String} filename Filename to save csv as
 * @param {Function} next callback
 * @public
 */
const seriesToCsv = (series, filename) => {
    fs.writeFile(path.join('data', `${filename}.json`), JSON.stringify(series.to_json()), err => {
        if (err) console.error(err);

        fs.readFile(path.join('data', `${filename}.json`), (err, data) => {
            if (err) console.log(err)
            let csvData = Papa.unparse([JSON.parse(data)]);

            fs.writeFile(path.join('data', `${filename}.csv`), csvData, err => {
                if (err) console.error(err);
                console.log('Wrote Series to csv');
            });
        });
    });
};

const dfToCsv = (df, filename) => {
    fs.writeFile(path.join('data', `${filename}.csv`, df.to_csv(), err => {
        if (err) console.error(err);
        console.log('Wrote DataFrame to csv.')
    }));
};

module.exports = {
    pdReadJsonDf,
    seriesToCsv
}