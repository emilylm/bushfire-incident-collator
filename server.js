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

let vicData = []
let nswData = []

const axios = require("axios");



//const url1 = "http://www.rfs.nsw.gov.au/feeds/majorIncidents.json";
const url1 = "http://www.mocky.io/v2/5e0ef86f34000088002d7dce";

const getNSWData = async url => {
  try {
    const response = await axios.get(url);
    const data = response.data.features;
    /*
    const data = []
    response.data.features.forEach(function (item){
      data.push({response.data.features.properties})
    })
    */
    parseNSWData(data)
    console.log("Data fetched length:", Object.entries(data).length);
  } catch (error) {
    console.log(error);
  }
};

parseNSWData = data => {
  let subset = []
  let countAll = 0
  let countBushfire = 0
  let totalSize = 0.0
  let countZero = 0

  data.forEach(function (item) {
    const description = item.properties.description
    let type = description.substr(description.indexOf("<br />TYPE:")+12)
    type = type.substr(0, type.indexOf(' <br />'))
    console.log("TYPE", type)
    let regExp = new RegExp('Bush Fire')
    if (type.match(regExp)){
      let size = description.substr(description.indexOf("<br />SIZE:")+12)
      size = parseFloat(size.substr(0, size.indexOf(' <br />')))
      if (size == 0){
        countZero++
      }
      totalSize = totalSize + size
      console.log("SIZE", size)
    }
  });
  console.log("TOTAL SIZE", totalSize)
  console.log("TOTAL ZERO", countZero)
    /*if (item.category2 == "Bushfire") {
      subset.push(item)
      countBushfire++

      if (item.incidentSize.test(regExp)){
        const size = parseFloat(item.incidentSize.substr(0,item.incidentSize.indexOf(' ')));

        totalSize = totalSize + size
        sizeHA++
      } else {
        switch ()
      }
        if (item.incidentSize == "SMALL"){
        sizeSmall++
      } else if (item.incidentSize == "UNKNOWN"){
        sizeUnknown++
      }
      console.log(item.incidentSize)
    }
  countAll++*/

}

getNSWData(url1);

//const url2 = "https://data.emergency.vic.gov.au/Show?pageId=getIncidentJSON";
const url2 = "http://www.mocky.io/v2/5e0ee7c83400000d002d7d67";
const getVICData = async url => {
  try {
    const response = await axios.get(url);
    const data = response.data.results;
    parseVICData(data)
    console.log("Data fetched length:", Object.entries(data).length);
  } catch (error) {
    console.log(error);
  }
};

//getVICData(url2);

parseVICData = data => {
  let subset = []
  //let sizes = []
  let countAll = 0
  let countBushfire = 0
  let sizeUnknown = 0
  let sizeSmall = 0
  let sizeMedium = 0
  let sizeLarge = 0
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
      } else {
        switch(item.incidentSize){
          case "SMALL":
            sizeSmall++
            break
          case "MEDIUM":
            sizeMedium++
            break
          case "LARGE":
            sizeLarge++
            break
          case "UNKNOWN":
            sizeUnknown++
            break
        }
      }
      console.log(item.incidentSize)
    }
  countAll++
  });
  vicData = subset
  console.log("Total small:", sizeSmall)
  console.log("Total medium:", sizeMedium)
  console.log("Total large:", sizeLarge)
  console.log("Total unknown:", sizeUnknown)
  console.log("Total known:", sizeHA)
  console.log("Totoal size of known:", totalSize)
  console.log("Total Incidents:", countAll)
  console.log("Total Bushfires:", countBushfire)
}

//if (Object.entries(vicData).length === 0 && vicData.constructor === Object)
