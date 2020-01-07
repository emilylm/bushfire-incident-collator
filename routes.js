

module.exports = (app) => {
    let controllers = require('./controllers.js');

    // Retrieve VIC CFA data
    app.get('/vic', controllers.getVIC);

    // Retrieve NSW RFS data
    app.get('/nsw', controllers.getNSW);

    // Retrieve NSW + VIC aggregated data
    app.get('/aggregate', controllers.getVICNSW);

    // Generate NSW data
    app.get('/generate/vic', controllers.generateVIC);

    // Generate VIC data
    app.get('/generate/nsw', controllers.generateNSW);

}
