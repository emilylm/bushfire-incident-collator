const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

let cfaData = {}

const axios = require("axios");
const url = "https://data.emergency.vic.gov.au/Show?pageId=getIncidentJSON";
//const url = "http://www.mocky.io/v2/5e0ee7c83400000d002d7d67";
const getData = async url => {
  try {
    const response = await axios.get(url);
    const data = response.data.results;
    parseData(data)
    console.log("Data fetched length:", Object.entries(data).length);
  } catch (error) {
    console.log(error);
  }
};

getData(url);

parseData = data => {
  let subset = []
  //let sizes = []
  let countAll = 0
  let countBushfire = 0
  let sizeUnknown = 0
  let sizeSmall = 0
  let sizeHA = 0
  let totalSize = 0.0
  let regExp = new RegExp('HA.')
  data.forEach(function (item) {
    if (item.category2 == "Bushfire") {
      subset.push(item)
      countBushfire++
      if (item.incidentSize.match(regExp)){
        const size = parseFloat(item.incidentSize.substr(0,item.incidentSize.indexOf(' ')));
        //sizes.push(size)
        totalSize = totalSize + size
        sizeHA++
      } else if (item.incidentSize == "SMALL"){
        sizeSmall++
      } else if (item.incidentSize == "UNKNOWN"){
        sizeUnknown++
      }
      console.log(item.incidentSize)
    }
  countAll++
  });
  console.log("Total small:", sizeSmall)
  console.log("Total unknown:", sizeUnknown)
  console.log("Total hectares:", sizeHA)
  console.log("Totoal size of known:", totalSize)
  console.log("Total Incidents:", countAll)
  console.log("Total Bushfires:", countBushfire)
}

//if (Object.entries(cfaData).length === 0 && cfaData.constructor === Object)
