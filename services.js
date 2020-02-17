const NSW = require('./models/nsw')
const VIC = require('./models/vic')
const MEL = require('./models/mel')
const SYD = require('./models/syd')
const BNE = require('./models/bne')
const DRW = require('./models/drw')
const CAN = require('./models/can')
const HBA = require('./models/hba')
const ADL = require('./models/adl')
const PER = require('./models/per')
const POLYS = require('./models/polys')
const BURNTPOLYS = require('./models/burntpolys')
const DISS_SHAS = require('./diss-shas');
const INT_SHAS = require('./int-shas');
require('dotenv').config()




const axios = require("axios")
//const CITIES = ["MEL", "SYD", "BNE", "ADL", "PER", "CAN", "DRW", "HBA"]
const fs = require('fs');




//Real VIC CFA API for use in prod:
const url1 = "http://www.rfs.nsw.gov.au/feeds/majorIncidents.json";

//MOCK APIs to prevent over-using the NSW RFS api during development:
//const url1 = "http://www.mocky.io/v2/5e0ef86f34000088002d7dce";
//const url1 = "https://3991a665-e25e-456d-bea3-00ee81f00ac5.mock.pstmn.io/nsw"

// Real NSW RFS API for use in prod:
const url2 = "https://data.emergency.vic.gov.au/Show?pageId=getIncidentJSON";

// MOCK APIs to prevent over-using the VIC CFA api during development:
//const url2 = "http://www.mocky.io/v2/5e0ee7c83400000d002d7d67";
//const url2 = "https://3991a665-e25e-456d-bea3-00ee81f00ac5.mock.pstmn.io/vic"



// Get latest VIC and NSW Data
const findLatestNSWVIC = async () => {
  try {
    const nsw_data = await findLatestNSW();
    const vic_data = await findLatestVIC();
    const agg_data = aggregateVICNSW(nsw_data.toObject(), vic_data.toObject());
    return agg_data
  }
  catch(e) {
    throw new Error(e.message)
  }
}

// Get latest valid NSW data in database
const findLatestNSW = async () => {
  try {
    let data = await NSW.findOne({valid: true}).sort({dateGenerated: -1}).exec();
    if (data == null) {
      throw new Error('Could not find latest valid NSW data')
    } else {
      return data;
    }
  }
  catch(e) {
    throw new Error(e.message)
  }
}

// Get latest valid VIC data in database
const findLatestVIC = async () => {
  try {
    let data = await VIC.findOne({valid: true}).sort({dateGenerated: -1}).exec();
    if (data == null) {
      throw new Error('Could not find latest valid NSW data', e)
    } else {
      return data;
    }
  }
  catch(e) {
    throw new Error(e.message)
  }
}


const getLatestPolysMel = async () => {
  try {
    let mel = await MEL.findOne({valid: true}).sort({dateGenerated: -1}).exec();
    return mel;
  }
  catch(e) {
    throw new Error(e.message)
  }
}


const getLatestPolys = async () => {
  try {
    const [mel, syd, drw, adl, bne, hba, per, can] = await Promise.all([
      MEL.findOne({valid: true}).sort({dateGenerated: -1}).exec(),
      SYD.findOne({valid: true}).sort({dateGenerated: -1}).exec(),
      DRW.findOne({valid: true}).sort({dateGenerated: -1}).exec(),
      ADL.findOne({valid: true}).sort({dateGenerated: -1}).exec(),
      BNE.findOne({valid: true}).sort({dateGenerated: -1}).exec(),
      HBA.findOne({valid: true}).sort({dateGenerated: -1}).exec(),
      PER.findOne({valid: true}).sort({dateGenerated: -1}).exec(),
      CAN.findOne({valid: true}).sort({dateGenerated: -1}).exec()
    ]);

    /*
    let mel = await MEL.findOne({valid: true}).sort({dateGenerated: -1}).exec();
    let syd = await SYD.findOne({valid: true}).sort({dateGenerated: -1}).exec();
    let drw = await DRW.findOne({valid: true}).sort({dateGenerated: -1}).exec();
    let adl = await ADL.findOne({valid: true}).sort({dateGenerated: -1}).exec();
    let bne = await BNE.findOne({valid: true}).sort({dateGenerated: -1}).exec();
    let hba = await HBA.findOne({valid: true}).sort({dateGenerated: -1}).exec();
    let per = await PER.findOne({valid: true}).sort({dateGenerated: -1}).exec();
    let can = await CAN.findOne({valid: true}).sort({dateGenerated: -1}).exec();
    */
    let returnObj = {MEL: mel, SYD: syd, DRW: drw, ADL: adl, BNE: bne, HBA: hba, PER: per, CAN: can}
    if (mel == null || syd == null || drw == null || adl == null  || bne == null || hba == null || per == null || can == null) {
      throw new Error('Could not find all polygons', e)
    } else {
      return returnObj;
    }
  }
  catch(e) {
    throw new Error(e.message)
  }
}


const getLatestPolysBurnt = async () => {
  try {
    let polys = await BURNTPOLYS.findOne({valid: true}).sort({dateGenerated: -1}).exec();
    if (polys.MEL == null || polys.SYD == null || polys.DRW == null || polys.ADL == null  || polys.BNE == null || polys.HBA == null || polys.PER == null || polys.CAN == null) {
      throw new Error('Could not find all burnt polygons', e)
    } else {
      return polys;
    }
  }
  catch(e) {
    throw new Error(e.message)
  }
}


// Generate polygons for a city
const generatePolysBurntCity = async (vicArea, nswArea, aggArea, city) => {
  let vic = await getPolygon(vicArea, city)
  let nsw = await getPolygon(nswArea, city)
  let aggregate = await getPolygon(aggArea, city)
  //let newMEL= undefined, newSYD= undefined, newBNE= undefined, newADL= undefined, newHBA= undefined, newCAN= undefined, newPER= undefined, newDRW = undefined
  switch(city){
    case "MEL":
      return {vic: vic, nsw: nsw, aggregate: aggregate, valid: true}
    case "SYD":
      return {vic: vic, nsw: nsw, aggregate: aggregate, valid: true}
    case "BNE":
      return {vic: vic, nsw: nsw, aggregate: aggregate, valid: true}
    case "DRW":
      return {vic: vic, nsw: nsw, aggregate: aggregate, valid: true}
    case "PER":
      return {vic: vic, nsw: nsw, aggregate: aggregate, valid: true}
    case "HBA":
      return {vic: vic, nsw: nsw, aggregate: aggregate, valid: true}
    case "CAN":
      return {vic: vic, nsw: nsw, aggregate: aggregate, valid: true}
    case "ADL":
      return {vic: vic, nsw: nsw, aggregate: aggregate, valid: true}
  }
}

// Generate all polygons
const generatePolysBurnt = async (vicArea, nswArea, aggArea) => {
  try {
    let mel = await generatePolysBurntCity(vicArea, nswArea, aggArea, 'MEL')
    let syd = await generatePolysBurntCity(vicArea, nswArea, aggArea, 'SYD')
    let bne = await generatePolysBurntCity(vicArea, nswArea, aggArea, 'BNE')
    let adl = await generatePolysBurntCity(vicArea, nswArea, aggArea, 'ADL')
    let hba = await generatePolysBurntCity(vicArea, nswArea, aggArea, 'HBA')
    let drw = await generatePolysBurntCity(vicArea, nswArea, aggArea, 'DRW')
    let can = await generatePolysBurntCity(vicArea, nswArea, aggArea, 'CAN')
    let per = await generatePolysBurntCity(vicArea, nswArea, aggArea, 'PER')
    //return [mel, syd, bne, adl, hba, drw, can, per]
    let polys = new BURNTPOLYS({valid: true, MEL: mel, SYD: syd, PER: per, ADL: adl, HBA: hba, CAN: can, BNE: bne, DRW: drw})
    return await polys.save()
    /*for(let city in CITIES){
      new = await generatePolysCity(vicArea, nswArea, aggArea, city)
    }*/
  } catch (e) {
    console.log("Error creating polygons", e)
    throw new Error(e.message)
  }
}

// Generate polygons for a city
const generatePolysCity = async (vicArea, nswArea, aggArea, city) => {
  let vic = await getPolygon(vicArea, city)
  let nsw = await getPolygon(nswArea, city)
  let aggregate = await getPolygon(aggArea, city)
  //let newMEL= undefined, newSYD= undefined, newBNE= undefined, newADL= undefined, newHBA= undefined, newCAN= undefined, newPER= undefined, newDRW = undefined
  switch(city){
    case "MEL":
      const mel = new MEL({vic: vic, nsw: nsw, aggregate: aggregate, valid: true})
      return newMEL = await mel.save()
    case "SYD":
      const syd = new SYD({vic: vic, nsw: nsw, aggregate: aggregate, valid: true})
      return newSYD = await syd.save()
    case "BNE":
      const bne = new BNE({vic: vic, nsw: nsw, aggregate: aggregate, valid: true})
      return newBNE = await bne.save()
    case "DRW":
      const drw = new DRW({vic: vic, nsw: nsw, aggregate: aggregate, valid: true})
      return newDRW = await drw.save()
    case "PER":
      const per = new PER({vic: vic, nsw: nsw, aggregate: aggregate, valid: true})
      return newPER = await per.save()
    case "HBA":
      const hba = new HBA({vic: vic, nsw: nsw, aggregate: aggregate, valid: true})
      return newHBA = await hba.save()
    case "CAN":
      const can = new CAN({vic: vic, nsw: nsw, aggregate: aggregate, valid: true})
      return newCAN = await can.save()
    case "ADL":
      const adl = new ADL({vic: vic, nsw: nsw, aggregate: aggregate, valid: true})
      return newADL = await adl.save()
  }
}

// Generate all polygons
const generatePolys = async (vicArea, nswArea, aggArea) => {
  try {
    const [mel, syd, drw, adl, bne, hba, per, can] = await Promise.all([
      generatePolysCity(vicArea, nswArea, aggArea, 'MEL'),
      generatePolysCity(vicArea, nswArea, aggArea, 'SYD'),
      generatePolysCity(vicArea, nswArea, aggArea, 'BNE'),
      generatePolysCity(vicArea, nswArea, aggArea, 'ADL'),
      generatePolysCity(vicArea, nswArea, aggArea, 'HBA'),
      generatePolysCity(vicArea, nswArea, aggArea, 'DRW'),
      generatePolysCity(vicArea, nswArea, aggArea, 'CAN'),
      generatePolysCity(vicArea, nswArea, aggArea, 'PER')
    ]);

    /*
    let mel = await generatePolysCity(vicArea, nswArea, aggArea, 'MEL')
    let syd = await generatePolysCity(vicArea, nswArea, aggArea, 'SYD')
    let bne = await generatePolysCity(vicArea, nswArea, aggArea, 'BNE')
    let adl = await generatePolysCity(vicArea, nswArea, aggArea, 'ADL')
    let hba = await generatePolysCity(vicArea, nswArea, aggArea, 'HBA')
    let drw = await generatePolysCity(vicArea, nswArea, aggArea, 'DRW')
    let can = await generatePolysCity(vicArea, nswArea, aggArea, 'CAN')
    let per = await generatePolysCity(vicArea, nswArea, aggArea, 'PER')
    */
    let returnObj = {MEL: mel, SYD: syd, DRW: drw, ADL: adl, BNE: bne, HBA: hba, PER: per, CAN: can}
    //return [mel, syd, bne, adl, hba, drw, can, per]
    /*for(let city in CITIES){
      new = await generatePolysCity(vicArea, nswArea, aggArea, city)
    }*/
  } catch (e) {
    console.log("Error creating polygons", e)
    throw new Error(e.message)
  }
}



/*
const getLatestPolys = async () => {
  try {
    let polys = await POLYS.findOne().sort( { dateGenerated: -1 } ).exec();
    if (polys.MEL == null || polys.SYD == null || polys.DRW == null || polys.ADL == null  || polys.BNE == null || polys.HBA == null || polys.PER == null || polys.CAN == null) {
      throw new Error('Could not find all polygons', e)
    } else {
      return polys;
    }
  }
  catch(e) {
    throw new Error(e.message)
  }
}
*/

// Generate polygons for a city
/*
const generatePolysCity = async (vicArea, nswArea, aggArea, city) => {
  let vic = await getPolygon(vicArea, city)
  let nsw = await getPolygon(nswArea, city)
  let aggregate = await getPolygon(aggArea, city)
  switch(city){
    case "MEL":
      return {vic: vic, nsw: nsw, aggregate: aggregate, valid: true}
    case "SYD":
      return {vic: vic, nsw: nsw, aggregate: aggregate, valid: true}
    case "BNE":
      return {vic: vic, nsw: nsw, aggregate: aggregate, valid: true}
    case "DRW":
      return {vic: vic, nsw: nsw, aggregate: aggregate, valid: true}
    case "PER":
      return {vic: vic, nsw: nsw, aggregate: aggregate, valid: true}
    case "HBA":
      return {vic: vic, nsw: nsw, aggregate: aggregate, valid: true}
    case "CAN":
      return {vic: vic, nsw: nsw, aggregate: aggregate, valid: true}
    case "ADL":
      return {vic: vic, nsw: nsw, aggregate: aggregate, valid: true}
  }
}

// Generate all polygons
const generatePolys = async (vicArea, nswArea, aggArea) => {
  try {
    let mel = await generatePolysCity(vicArea, nswArea, aggArea, 'MEL')
    let syd = await generatePolysCity(vicArea, nswArea, aggArea, 'SYD')
    let bne = await generatePolysCity(vicArea, nswArea, aggArea, 'BNE')
    let adl = await generatePolysCity(vicArea, nswArea, aggArea, 'ADL')
    let hba = await generatePolysCity(vicArea, nswArea, aggArea, 'HBA')
    let drw = await generatePolysCity(vicArea, nswArea, aggArea, 'DRW')
    let can = await generatePolysCity(vicArea, nswArea, aggArea, 'CAN')
    let per = await generatePolysCity(vicArea, nswArea, aggArea, 'PER')
    let polys = new POLYS({valid: true, MEL: mel, SYD: syd, PER: per, ADL: adl, HBA: hba, CAN: can, BNE: bne, DRW: drw})
    return await polys.save()
  } catch (e) {
    console.log("Error creating polygons", e)
    throw new Error(e.message)
  }
}

*/
const getPolygon = async(input_area, city) => {

  let max_rad = Number.MIN_VALUE;
  let result_rad = undefined;

  let max_interval = Number.MIN_VALUE;
  let result_interval = 0;
  const path1 = "https://api.github.com/repos/emilylm/aus-ssc-polygons/contents/tables/" + city + ".json"
  console.log("PATH", path1)
  const rawdata = await axios.get(path1, {headers: {"Accept":"application/vnd.github.v3.raw"}, auth: {
      username: 'emilylm',
      password: process.env.GH_ACCESS_TOKEN

    }})
  let dataJ = JSON.stringify(rawdata.data)
  //console.log("DATA: ", dataJ)

  let data = JSON.parse(dataJ);

  for(let obj in data){
      const area = data[obj].total
      if ((area >= max_rad) && (area <= input_area)){
        max_rad = area;
        result_rad = obj
      }
  }

  let max_obj = Math.max.apply(null, Object.keys(parseInt(data)))
  let next_obj = parseInt(result_rad)+1
  while(!(next_obj in data)){
    next_obj = next_obj + 1
    /*
    if (next_obj == max_obj){
      next_obj = result_rad
    }
    */
  }
  let target_obj = data[next_obj]
  let sum_area = max_rad
  let max_int = Math.max.apply(null, Object.keys(target_obj.intervals))

  for (let i = 0; i <= max_int; i++) {
    if (i in target_obj.intervals){
      if (sum_area + parseFloat(target_obj.intervals[i].total) > input_area){
        break
      } else {
        sum_area = sum_area + parseFloat(target_obj.intervals[i].total)
        //console.log("SUM AREA:  ", sum_area)
        if ((sum_area <= input_area) && (sum_area >= max_rad)){
          max_rad = sum_area;
          result_interval = i
        }
      }
    }
  }

  console.log("AREA: ", max_rad)

  let next_int = parseInt(result_interval) + 1

  let residual_area = input_area - max_rad
  console.log("RESIDUAL AREA: ", residual_area)

  while(next_int < 12){
    if (next_int.toString() in target_obj.intervals){
      break
    } else {
      next_int = next_int + 1
    }
  }

  let target_orders = {}
  let int_sum = 0
  if (next_int == target_obj.intervals.length){
    target_orders = target_obj.intervals[next_int].polys
  } else {
    for(let ord_obj in target_obj.intervals[next_int].polys){
      const area = target_obj.intervals[next_int].polys[ord_obj]
      if(int_sum + area <= residual_area){
        int_sum = int_sum + area
        target_orders[ord_obj] = target_obj.intervals[next_int].polys[ord_obj]
      }
    }
  }


  // GET AXIOS
  let diss_str = city + '_' + result_rad.toString() + '_clean.geojson'
  let int_str = city + '_' + next_obj.toString()  + '_clean.geojson'

  let diss_sha = DISS_SHAS[diss_str]
  let int_sha = INT_SHAS[int_str]

  let path2 = 'https://api.github.com/repos/emilylm/aus-ssc-polygons/git/blobs/' + diss_sha
  let path3 = 'https://api.github.com/repos/emilylm/aus-ssc-polygons/git/blobs/' + int_sha
  const big_poly = await axios.get(path2, {headers: {"Accept":"application/vnd.github.v3.raw"}, auth: {
      username: 'emilylm',
      password: process.env.GH_ACCESS_TOKEN
    }})
  const int_poly = await axios.get(path3, {headers: {"Accept":"application/vnd.github.v3.raw"}, auth: {
      username: 'emilylm',
      password: process.env.GH_ACCESS_TOKEN
    }})
  let bigD = JSON.stringify(big_poly.data)
  let intD = JSON.stringify(int_poly.data);
  //let path1 = '/Users/gmarshall/Desktop/layers_map/lookup_tables/clean_dissolved/' + city + '_' + result_rad.toString() + '_clean.geojson'
  //let path2 = '/Users/gmarshall/Desktop/layers_map/lookup_tables/clean_intervals/' + city + '_' + next_obj.toString()  + '_clean.geojson'
  //let big_poly = fs.readFileSync(path1);
  let big_data = JSON.parse(bigD);
  //let int_poly = fs.readFileSync(path2);
  let int_data = JSON.parse(intD);

  console.log("Loaded " + big_data.features.length + " dissolve features")
  console.log("Loaded " + int_data.features.length + " interval features")

  var turf = require('@turf/turf');


  let features_union = []

  for (var feature in int_data.features){
    let property = 'RAD_' + city
    let rad = int_data.features[feature].properties[property]
    let ord = int_data.features[feature].properties.ORD_PREV
    if ((parseInt(ord) <= result_interval) || ((parseInt(ord) == next_int) && (int_data.features[feature].properties.SSC_CODE16 in target_orders))){
      features_union.push(int_data.features[feature])
    }
  }
  big_data.features = big_data.features.concat(features_union)

  var union_data = turf.union(...big_data.features)

  var options = {tolerance: 0.005, highQuality: false};
  var simplified = turf.simplify(union_data, options);

  console.log("COMPLETE")

  return simplified

}


// Generate VIC Summary
const generateVICSummary = async () => {
  try {
    const stats = await getVICData()
    const vic = new VIC(stats)
    return newVIC = await vic.save()
  } catch (error) {
    console.log("Error creating VIC summary", e)
    throw new Error(e.message)
  }
}

// Generate NSW Summary
const generateNSWSummary = async () => {
  try {
    const stats = await getNSWData()
    const nsw = new NSW(stats)
    return newNSW = await nsw.save()
  } catch (error) {
    console.log("Error creating NSW summary", e)
    throw new Error(e.message)
  }
}

// Function to fetch data from VIC CFA
const getVICData = async () => {
  try {
    const response = await axios.get(url2);
    const data = response.data.results;
    console.log("Data fetched length (VIC):", Object.entries(data).length);
    const stats = parseVICData(data)
    return stats
  } catch (error) {
    console.log(error);
  }
};

//function to fetch NSW RFS
const getNSWData = async () => {
  try {
    const response = await axios.get(url1);
    const data = response.data.features;
    console.log("Data fetched length (NSW):", Object.entries(data).length);
    const stats = parseNSWData(data)
    return stats
  } catch (error) {
    console.log(error);
  }
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
    let regExp1 = new RegExp('Bush Fire')
    let regExp2 = new RegExp('Grass Fire')
    if (type.match(regExp1) || type.match(regExp2)){
      let size = description.substr(description.indexOf("<br />SIZE:")+12)
      size = parseFloat(size.substr(0, size.indexOf(' <br />')))
      if (size == 0){
        countZero++
      }
      totalSize = totalSize + size
      countWildfires++
    }
    countAll++
  });

  let nonBushfireCount = countAll - countWildfires

  const summary = {
    count: {
      wildfire: countWildfires,
      nonWildfire: nonBushfireCount,
      total: countAll
    },
    area: {
      total: totalSize,
      unit: 'hectares',
      unquantifiedFires: {
        zeroAreaCount: countZero
      }
    },
    dateGenerated: new Date(),
    valid: true
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
  let sizeSpot = 0
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
          case "SPOT":
            sizeSpot++
            break
          case "UNKNOWN":
            sizeUnknown++
            break
        }
      }
    }
  countAll++
  });
  let nonBushfireCount = countAll - countBushfires

  const summary = {
    count: {
      wildfire: countBushfires,
      nonWildfire: nonBushfireCount,
      total: countAll
    },
    area: {
      total: totalSize,
      unit: 'hectares',
      unquantifiedFires: {
        smallAreaCount: sizeSmall,
        mediumAreaCount: sizeMedium,
        largeAreaCount: sizeLarge,
        spotAreaCount: sizeSpot,
        unknownAreaCount: sizeUnknown,
      }
    },
    dateGenerated: new Date(),
    valid: true
  }
  return summary
}



// Aggregate latest valid VIC and NSW data
const aggregateVICNSW = (nsw, vic) => {
  const totalSize = vic.area.total + nsw.area.total
  const countBushfires = vic.count.wildfire + nsw.count.wildfire
  const countAll = vic.count.total + nsw.count.total
  const nonBushfireCount = countAll - countBushfires
  const date1 = new Date(vic.dateGenerated)
  const date2 = new Date(nsw.dateGenerated)
  const dateGenerated = (date1 <= date2) ? date1 : date2;

  const summary = {
    count: {
      wildfire: countBushfires,
      nonWildfire: nonBushfireCount,
      total: countAll
    },
    area: {
      total: totalSize,
      nsw: nsw.area.total,
      vic: vic.area.total,
      unit: 'hectares',
      unquantifiedFires: {
        smallAreaCount: vic.area.unquantifiedFires.smallAreaCount,
        mediumAreaCount: vic.area.unquantifiedFires.mediumAreaCount,
        largeAreaCount: vic.area.unquantifiedFires.largeAreaCount,
        unknownAreaCount: vic.area.unquantifiedFires.unknownAreaCount,
        spotAreaCount: vic.area.unquantifiedFires.spotAreaCount,
        zeroAreaCount: nsw.area.unquantifiedFires.zeroAreaCount
      }
    },
    dateGenerated: dateGenerated
  }
  return summary
}



module.exports = {
  findLatestNSWVIC,
  findLatestNSW,
  findLatestVIC,
  generateVICSummary,
  generateNSWSummary,
  generatePolys,
  getLatestPolys,
  getLatestPolysMel,
  getLatestPolysBurnt,
  generatePolysBurntCity,
  generatePolysBurnt
}
