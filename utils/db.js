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
    load: sql => {
        console.log(sql);
        return mysql_query(sql);
    },
    add: (table, entity) => {
            return mysql_query(`insert into ${table} set ?`, entity);
        }
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