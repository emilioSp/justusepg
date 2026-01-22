import knex from 'knex';
import knexconfig from '../knexfile.ts';

const environment = process.env.NODE_ENV || 'development';
const configOptions = knexconfig[environment];

const db = knex(configOptions);

export default db;
