const axios = require("axios");

const url1 = "http://www.rfs.nsw.gov.au/feeds/majorIncidents.json";
/*
MOCK API to prevent over-using the NSW RFS api during development:
const url1 = "http://www.mocky.io/v2/5e0ef86f34000088002d7dce";
*/

const url2 = "https://data.emergency.vic.gov.au/Show?pageId=getIncidentJSON";
/*
MOCK API to prevent over-using the VIC CFA api during development:
const url2 = "http://www.mocky.io/v2/5e0ee7c83400000d002d7d67";
*/



// Retrieve and return all notes from the database.
exports.aggregateNSW = async (req, res) => {
  const stats = await getNSWData(url1)
  console.log("STATS", stats)
  res.json({'currentFires': stats})
};

// Find a single note with a noteId
exports.aggregateVIC = async (req, res) => {
  const stats = await getVICData(url2)
  res.json({'currentFires': stats})
};

exports.aggregateStates = async (req, res) => {
  const stats = await getStatesData(url1, url2)
  res.json({'currentFires': stats})
};


// Function to fetch data from VIC CFA

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

//function to fetch NSW RFS
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
}

//function to fetch NSW and VIC data
const getStatesData = async (url1, url2) => {
  try {
    const resNSW = await axios.get(url1)
    const data1 = resNSW.data.features
    const resVIC = await axios.get(url2)
    const data2 = resVIC.data.results
    const stats1 = parseNSWData(data1)
    const stats2 = parseVICData(data2)
    const statsAll = aggregateStates(stats1, stats2)
    return statsAll
  } catch (error) {
    console.log(error);
  }
}



//function to aggregate data fetched from VIC CFA and NSW RFA
const aggregateStates = (nsw, vic) => {
  console.log("VICCCCC", JSON.stringify(vic))
  console.log("NSWWWWWWWW", JSON.stringify(nsw))

  const totalSize = vic.area.total + nsw.area.total
  const countBushfires = vic.count.wildfire + nsw.count.wildfire
  const countAll = vic.count.total + nsw.count.total
  const nonBushfireCount = countAll - countBushfires

  const summary = {
    'count': {
      wildfire: countBushfires,
      nonWildfire: nonBushfireCount,
      total: countAll
    },
    'area': {
      'total': totalSize,
      'totalUnit': 'hectares',
      'unquantifiedFires': {
        'smallAreaCount': vic.area.unquantifiedFires.smallAreaCount,
        'mediumAreaCount': vic.area.unquantifiedFires.mediumAreaCount,
        'largeAreaCount': vic.area.unquantifiedFires.largeAreaCount,
        'unknownAreaCount': vic.area.unquantifiedFires.unknownAreaCount,
        'zeroAreaCount': nsw.area.unquantifiedFires.zeroAreaCount
      }
    }
  }
  console.log("SUMMARY", summary)
  return summary
}

// Function to parse raw data from NSW RFA
const parseNSWData = data => {
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
      nonWildfire: nonBushfireCount,
      total: countAll
    },
    'area': {
      'total': totalSize,
      'totalUnit': 'hectares',
      'unquantifiedFires': {
        'zeroAreaCount': countZero
      }
    }
  }
  return summary
}


// Function to parse raw data from VIC CFA

const parseVICData = data => {
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
      'nonWildfire': nonBushfireCount,
      total: countAll
    },
    'area': {
      'total': totalSize,
      'totalUnit': 'hectares',
      'unquantifiedFires': {
        'smallAreaCount': sizeSmall,
        'mediumAreaCount': sizeMedium,
        'largeAreaCount': sizeLarge,
        'unknownAreaCount': sizeUnknown,
      }
    }
  }
  return summary
}
