const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
    connectionLimit: 50,
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'online_aution'

})

const mysql_query = util.promisify(pool.query).bind(pool);
module.exports = {
    load: sql => mysql_query(sql),
    // load: sql => new Promise((done, fail) => {
    //     pool.query(sql, (error, results, fields) => {
    //         if (error) {
    //             return fail(error);
    //         } else {
    //             done(results);
    //         }
    //     });
    // })
}