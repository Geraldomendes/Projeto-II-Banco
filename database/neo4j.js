const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
    process.env.NEO4J_URL, 
    neo4j.auth.basic(
        process.env.NEO4J_USUARIO, 
        process.env.NEO4J_SENHA
    ),
);

module.exports = driver;
