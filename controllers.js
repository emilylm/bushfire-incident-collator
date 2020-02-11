const { findLatestNSWVIC,
findLatestNSW,
findLatestVIC,
generateVICSummary,
generateNSWSummary,
generatePolys,
getLatestPolys,
getLatestPolysMel } = require('./services')


exports.getPolysMel = async (req, res) => {
  try {
    const mel = await getLatestPolysMel()
    console.log("Finding latest polys")
    return res.status(201).json(mel);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
}

exports.getPolys = async (req, res) => {
  try {
    const polys = await getLatestPolys()
    console.log("Finding latest polys")
    return res.status(201).json(polys);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve and return all notes from the database.
exports.getNSW = async (req, res) => {
  try {
    const stats = await findLatestNSW()
    console.log("Finding NSW summary")
    return res.status(201).json({'currentFires': stats});
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

// Find a single note with a noteId
exports.getVIC = async (req, res) => {
  try {
    const stats = await findLatestVIC()
    console.log("Finding VIC summary")
    return res.status(201).json({'currentFires': stats});
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVICNSW = async (req, res) => {
  try {
    const stats = await findLatestNSWVIC()
    console.log("Finding VIC summary")
    return res.status(201).json({'currentFires': stats});
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

exports.generateVIC = async (req, res) => {
  try {
    const vic = await generateVICSummary()
    console.log("Generating VIC summary")
    return res.status(201).json(vic);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
}

exports.generateNSW = async (req, res) => {
  try {
    const nsw = await generateNSWSummary()
    console.log("Generating NSW summary")
    return res.status(201).json(nsw);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
}


exports.generateAgg = async (req, res) => {
  try {
    const nsw = await generateNSWSummary()
    const vic = await generateVICSummary()
    console.log("Generating NSW and VIC summary")
    return res.status(201).json({nsw: nsw, vic: vic});
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
}
