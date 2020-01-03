

module.exports = (app) => {
    let controllers = require('./controllers.js');

    // Retrieve VIC CFA data
    app.get('/vic', controllers.aggregateVIC);

    // Retrieve NSW RFS data
    app.get('/nsw', controllers.aggregateNSW);

    // Retrieve NSW + VIC aggregated data
    app.get('/aggregate', controllers.aggregateStates);

}
