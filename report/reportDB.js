var mongoose = require('mongoose');
var models = require('./models');

var Report = mongoose.model('Report', models.ReportSchema);

exports.Report = Report;

exports.saveReport = function (reportData) {
  var report = new Report(reportData);
  return new Promise((resolve, reject) => {
    report.save()
      .then(reportCreated => {
        resolve(reportCreated);
      }).catch(err => {
        console.log("Error saving report" + err.message)
        reject(err);
      });
  });
}

exports.findNumReports = function (id, typeReport) {

  return new Promise((resolve, reject) => {
    Report.find({
      type: typeReport,
      typeId: id
    }, function (err, reports) {
      if (err) {
        reject(err);
      }
      var numReports = reports.length;
      resolve(numReports);
    });
  });
}

exports.getReports = function (types) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(types)) {
      var error = { message: "Types tiene que ser un array" };
      reject(error);
    }
    if (types.length > 0) {
      var typesQuery = [];
      types.forEach(element => {
        typesQuery.push({ type: element });
      });
      Report.find({ $or: typesQuery }, (err, reports) => {
        if (err) {
          console.log("Error finding reports with these types", err);
          reject(err);
        }
        resolve(reports);
      });
    } else {
      Report.find({}, (err, reports) => {
        if (err) {
          console.log("Error finding all reports", err);
          reject(err);
        }
        resolve(reports);
      });
    }
  })
}