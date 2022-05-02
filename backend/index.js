`use strict`;

const { start,init } = require('./server');

const startServer = async () => {
    await init();
    await start();
};

startServer();