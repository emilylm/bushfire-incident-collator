const axios = require("axios");

const url1 = "http://www.rfs.nsw.gov.au/feeds/majorIncidents.json";
/*
MOCK API to prevent over-using the NSW RFS api during development:
const url1 = "http://www.mocky.io/v2/5e0ef86f34000088002d7dce";
*/

const url2 = "https://data.emergency.vic.gov.au/Show?pageId=getIncidentJSON";
/*
MOCK API to prevent over-using the CFA api during development:
const url2 = "http://www.mocky.io/v2/5e0ee7c83400000d002d7d67";
*/



// Retrieve and return all notes from the database.
exports.aggregateNSW = async (req, res) => {
  const stats = await getNSWData(url1)
  console.log("STATS", stats)
  res.json({'current-fires': stats})
};

// Find a single note with a noteId
exports.aggregateVIC = async (req, res) => {
  const stats = await getVICData(url2)
  res.json({'current-fires': stats})
};


const getNSWData = async url => {
  try {
    const response = await axios.get(url);
    const data = response.data.features;
    const stats = parseNSWData(data)
    console.log("Data fetched length:", Object.entries(data).length);
    return stats
  } catch (error) {
    console.log(error);
  }
};

parseNSWData = data => {
  let subset = []
  let countAll = 0
  let countWildfires = 0
  let totalSize = 0.0
  let countZero = 0
  data.forEach(function (item) {
    const description = item.properties.description
    let type = description.substr(description.indexOf("<br />TYPE:")+12)
    type = type.substr(0, type.indexOf(' <br />'))
    console.log("TYPE", type)
    let regExp1 = new RegExp('Bush Fire')
    let regExp2 = new RegExp('Grass Fire')
    if (type.match(regExp1) || type.match(regExp2)){
      let size = description.substr(description.indexOf("<br />SIZE:")+12)
      size = parseFloat(size.substr(0, size.indexOf(' <br />')))
      if (size == 0){
        countZero++
      }
      totalSize = totalSize + size
      console.log("SIZE", size)
      countWildfires++
    }
    countAll++
  });
  console.log("TOTAL SIZE", totalSize)
  console.log("TOTAL ZERO", countZero)

  let nonBushfireCount = countAll - countWildfires

  const summary = {
    'count': {
      wildfire: countWildfires,
      'non-wildfire': nonBushfireCount,
      total: countAll
    },
    'area': {
      'total': totalSize,
      'unquantified-fires': {
        'zero-area-count': countZero
      }
    }
  }
  return summary
}




const getVICData = async url => {
  try {
    const response = await axios.get(url);
    const data = response.data.results;
    const stats = parseVICData(data)
    console.log("Data fetched length:", Object.entries(data).length);
    return stats
  } catch (error) {
    console.log(error);
  }
};


parseVICData = data => {
  let subset = []
  let countAll = 0
  let countBushfires = 0
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
      countBushfires++
      if (item.incidentSize.match(regExp)){
        const size = parseFloat(item.incidentSize.substr(0,item.incidentSize.indexOf(' ')));
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
  let nonBushfireCount = countAll - countBushfires

  const summary = {
    'count': {
      wildfire: countBushfires,
      'non-wildfire': nonBushfireCount,
      total: countAll
    },
    'area': {
      'total': totalSize,
      'unquantified-fires': {
        'small-area-count': sizeSmall,
        'medium-area-count': sizeMedium,
        'large-area-count': sizeLarge,
        'unknown-area-count': sizeUnknown,
      }
    }
  }
  return summary
}
