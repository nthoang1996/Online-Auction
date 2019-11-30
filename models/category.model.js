const db = require('../utils/db');
module.exports = {
    all: (table) => { return db.load(`select * from ${table};`) },
    all_by_level: (table, level) => { return db.load(`select * from ${table} where level = ${level}`) },
    single_by_id: (table, id) => { return db.load(`select * from ${table} where id = ${id}`) },
    all_by_pid: (table, id) => { return db.load(`select * from ${table} where parent_id = ${id}`) },
    add: (table, entity) => { return db.add(table, entity) },
    del: (table, entity) => { return db.del(table, entity) },
    edit: (table, entity, entityId) => {
        return db.edit(table, entity, entityId)
    },
};