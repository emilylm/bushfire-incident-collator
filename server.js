require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

/*option to whitelist clients
var whitelist = ['http://localhost:3000', 'http://localhost:3001']

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
*/

// import cron module
const cron = require('node-cron');


// create express app
const app = express();
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// allow CORS for whitelisted hosts
//app.use(cors(corsOptions));

// allow CORS
app.use(cors());


// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to the Bushfire Incident Collator API."});
});

require('./routes.js')(app);

const { generateVICSummary, generateNSWSummary } = require('./services')

//schedule cron tasks
cron.schedule('30 * * * *', async function () {
  try {
    const date = new Date()
    console.log('Running Cron Job');
    console.log('Time: ', date);
    let vic = await generateVICSummary()
    let nsw = await generateNSWSummary()
    console.log('Generating Summaries')
    console.log(await vic);
    console.log(await nsw);
  } catch(err) {
    console.log('Could not generate summaries', err)
  }
});

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
