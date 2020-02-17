

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

    // Get polys
    app.get('/polys', controllers.getPolys);

    // Get polys mel
    app.get('/polys/mel', controllers.getPolysMel);

    // Generate burnt polys
    app.get('/generate/polys/burnt/:vicArea/:nswArea', controllers.generatePolysBurnt);

    // Get burnt polys
    app.get('/polys/burnt', controllers.getPolysBurnt);
}
