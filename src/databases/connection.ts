import knex from 'knex';

const database = knex({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'yourPassword',
        database: 'testapi'
    }
});

export default database;