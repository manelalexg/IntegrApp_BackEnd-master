// Controller of report

var config = require('config');
var reportDB = require('./reportDB');
var jwt = require('jsonwebtoken');
var userDB = require('../users/usersDB');
var advertDB = require('../advert/advertDB');
var forumDB = require('../forum/forumDB');

exports.createReport = function (req, res, next) {
  var reportData = req.body;

  verifyFieldsReport(reportData, req.decoded).then(verif => {
    var reportDoc = createReportDocument(reportData, req.decoded);

    reportDB.saveReport(reportDoc).then(report => {
      res.send(report);
    }).catch(err => {
      res.status(400).json({ message: "error en saving report: " + err.message });
    });
  }).catch(err => {
    res.status(400).json({ message: err.message });
  });
}

exports.getReports = function (req, res, next) {
  var types = req.query.type;
  var typesToGet = [];
  if (types != undefined) {
    typesToGet = types.split(',');
    typesToGet = typesToGet.filter(Boolean);
    var typesb = verifyTypeReport(typesToGet);
    if (!typesb) {
      res.status(400).json({ message: "Tipo no válido." });
      return;
    }
  }

  reportDB.getReports(typesToGet).then(reports => {
    res.send(reports);
  }).catch(err => {
    res.status(400).json({ message: err.message });
  });
}

createReportDocument = function (reportData, decoded) {
  var report = {};
  report['description'] = reportData.description;
  report['userId'] = decoded.userID;
  report['type'] = reportData.type;
  var today = new Date();
  today.setHours(today.getHours() + 2);
  // today.toLocaleString();
  today = today.toLocaleString();
  report['createdAt'] = today;
  report['typeId'] = reportData.typeId;
  return report;
}

verifyFieldsReport = function (reportData, decoded) {
  return new Promise((resolve, reject) => {
    var validTypes = ["user", "advert", "forum"];

    if (!reportData.description || !reportData.type) {
      reject({ message: "faltan datos obligatorios: description, type" });
    }

    if (validTypes.indexOf(reportData.type) < 0) {
      reject({ message: "type tiene que ser uno de estos valores: [user, advert, forum]" });
    }

    userDB.findUserById(decoded.userID).then(res => {
      if (res == null) {
        reject({ message: "el usuario no existe" });
      } else {
        if (reportData.type == "advert") {
          advertDB.findAdvertById(reportData.typeId).then(res => {
            if (res == null) reject({ message: "el advert con id=typeId no existe" });
            else resolve({ advert: res });
          }).catch(err => {
            reject({ message: "Ha habido un error: " + err.message });
          });
        } else if (reportData.type == "forum") {
          forumDB.findForumById(reportData.typeId).then(res => {
            if (res == null) reject({ message: "el forum con id=typeId no existe" })
            else resolve({ forum: res });
          }).catch(err => {
            reject({ message: "Ha habido un error: " + err.message });
          });
        } else if (reportData.type == "user") {
          userDB.findUserById(reportData.typeId).then(res => {
            if (res == null) reject({ message: "el user con id=typeId no existe" });
            else resolve({ user: res });
          }).catch(err => {
            reject({ message: "Ha habido un error: " + err.message });
          });
        } else {
          reject({ message: "No se ha encontrado este type." });
        }
      }
    }).catch(err => {
      reject({ message: "Ha habido un error: " + err.message });
    })
  });
}

verifyTypeReport = function (typesToVerify) {
  var validTypes = ["user", "advert", "forum"];
  var result = true;
  if (typesToVerify.length > 0) {
    typesToVerify.forEach(element => {
      if (validTypes.indexOf(element) == -1) {
        result = false;
      }
    });
  }
  return result;
}