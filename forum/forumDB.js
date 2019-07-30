var mongoose = require('mongoose');
var models = require('./models');

var Forum = mongoose.model('Forum', models.ForumSchema);
var ForumEntry = mongoose.model('ForumEntry', models.ForumEntrySchema);

exports.Forum = Forum;
exports.ForumEntry = ForumEntry;

exports.saveForum = function (forumData) {
  var forum = new Forum(forumData);
  return new Promise((resolve, reject) => {
    forum.save()
      .then(forumCreated => {
        resolve(forumCreated);
      }).catch(err => {
        console.log("Error saving forum" + err.message)
        reject(err);
      });
  });
}

exports.voteForum = function(forumData, newRate) {
  return new Promise((resolve, reject) => {
    if(!forumData.numberRates) {
      numRates = 0;

      Forum.findOneAndUpdate({ _id:forumData._id }, {
        $set: {
          rate: newRate,
          numberRates: 1
        }
      }, { new: true }, function (err, doc) {
        if (!err) {
          resolve(doc);
        } else {
          reject({ message: "Error rating Forum" });
        }
      })
    }
    else {
      var numRates = forumData.numberRates;

      if(numRates == 0) {
        Forum.findOneAndUpdate({ _id:forumData._id }, {
          $set: {
            rate: newRate,
            numberRates: 1
          }
        }, { new: true }, function (err, doc) {
          if (!err) {
            resolve(doc);
          } else {
            reject({ message: "Error rating Forum" });
          }
        })
      }
  
      else {
        var rateActual = forumData.rate;
        rateActual = rateActual * numRates;
        rateActual = rateActual + newRate;
        numRates = numRates + 1;
        rateActual = rateActual / numRates;
        Forum.findOneAndUpdate({ _id:forumData._id }, {
          $set: {
            rate: rateActual,
            numberRates: numRates
          }
        }, { new: true }, function (err, doc) {
          if (!err) {
            resolve(doc);
          } else {
            reject({ message: "Error rating Forum" });
          }
        })
      }
    }
  })
}

exports.findForumById = function (id) {
  return new Promise(function (resolve, reject) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) { //verifica que la id es vàlida
      Forum.findById(id, function (err, forum) {
        if (err) {
          reject(err);
        }
        resolve(forum);
      });
    } else {
      reject({ message: "forumId no vàlido." })
    }
  });
}

exports.modifyForum = function (forumId, content) {
  return new Promise(function (resolve, reject) {
    var modifTODO = {};
    if (content.title) {
      modifTODO.title = content.title;
    }
    if (content.description) {
      modifTODO.description = content.description;
    }
    
    Forum.findOneAndUpdate({ _id: forumId }, {
      $set: modifTODO
    }, { new: true },
      function (err, doc) {
        if (!err) resolve(doc);
        else reject({ message: "Error modifying forum" });
      });
  });
}

exports.saveForumEntry = function (forumEntry) {
  var forumEntry = new ForumEntry(forumEntry);
  return new Promise((resolve, reject) => {
    forumEntry.save()
      .then(forumEntryCreated => {
        resolve(forumEntryCreated);
      }).catch(err => {
        console.log("Error saving forum entry" + err.message)
        reject(err);
      });
  });
}

exports.getForumEntries = function (forumId) {
  return new Promise((resolve, reject) => {
    if (forumId.match(/^[0-9a-fA-F]{24}$/)) { //verifica que la id es vàlida
      ForumEntry.find({ forumId: forumId }, function (err, entries) {
        if (err) {
          reject(err);
        }
        resolve(entries);
      });
    } else {
      reject({ message: "forumId no vàlido." })
    }
  });
}

exports.deleteEntry = function (id, userId) {
  return new Promise((resolve, reject) => {
    if (userId.match(/^[0-9a-fA-F]{24}$/) && id.match(/^[0-9a-fA-F]{24}$/)) {
      ForumEntry.findById(id, function (err, res) {
        if (res) {
          if (res.userId == userId) {
            ForumEntry.remove({ _id: id }, function (err) {
              if (err) {
                reject(err);
              }
              resolve({ message: "Comentario eliminado" });
            });
          } else {
            reject({ message: "No eres el autor del comentario" });
          }
        } else {
          reject({ message: "Comentario no encontrado" });
        }
      });
    } else {
      reject({ message: "userId o advertId invalid" });
    }
  });
}

exports.getForums = function (types) {
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
      Forum.find({ $or: typesQuery }, (err, forums) => {
        if (err) {
          console.log("Error finding forums with this types", err);
          reject(err);
        }
        resolve(forums);
      });
    } else {
      Forum.find({}, (err, forums) => {
        if (err) {
          console.log("Error finding all forums", err);
          reject(err);
        }
        resolve(forums);
      });
    }
  })
}