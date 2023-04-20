const Rid = require('../models/rid');
const csvToJson = require('csvtojson');
const path = require('path');


exports.getAll = async (req, res) => {
  const panels = await Rid.find();
  res.json(panels);
};

exports.getById = async (req, res) => {
  const panel = await Rid.findById(req.params.id);
  res.json(panel);
};

exports.create = async (req, res) => {
  const panel = new Rid(req.body);
  await panel.save();
  res.json(panel);
};

exports.update = async (req, res) => {
  await Rid.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: 'Rid updated' });
};

exports.delete = async (req, res) => {
  await Rid.findByIdAndDelete(req.params.id);
  res.json({ message: 'Rid deleted' });
};


exports.upload = async (req, res) => {
  if (req.file == undefined) {
    return res.status(400).send("Please upload a CSV file!");
  }
  const dir = path.join(process.env.UPLOAD_PATH, 'uploads') || '/uploads';
  let csvData = [];
  let csvPath = path.join(dir, req.file.filename);
    
    console.log(csvPath)
    
  const json = await csvToJson().fromFile(csvPath);

  console.log(json)

    for(let val of json){
    console.log(val)
      await Rid.create(val)
      .then(doc => {
          // console.log(doc)
        csvData.push(doc);
      })
      .catch(err => {
      
        console.log(err)
      })
    }
  
    res.status(200).json({
      m: "CSV Data",
      d: csvData
    })
    

};