const { findLatestNSWVIC,
findLatestNSW,
findLatestVIC,
generateVICSummary,
generateNSWSummary } = require('./services')


// Retrieve and return all notes from the database.
exports.getNSW = async (req, res) => {
  try {
    const stats = await findLatestNSW()
    console.log("Finding VIC summary")
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
