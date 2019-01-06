const sql = require('mssql');

const dbConfig = {
    user: 'matt.li',
    password: '%3lue3!t%',
    server: 'BBC-VPC-SQL01.bluebit.local',
    database: 'BlueBit'
}

var connection = new sql.ConnectionPool(dbConfig);

module.exports = {
    dbConfig,
    connection
}