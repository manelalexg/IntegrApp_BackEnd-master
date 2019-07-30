var mongoose = require('mongoose');
var models = require('./models');

var Advert = mongoose.model('Advert', models.AdvertSchema);
var usersDB = require('../users/usersDB');
var inscriptionDB = require('../inscription/inscriptionDB');
var reportDB = require('../report/reportDB');

exports.Advert = Advert;

exports.uploadImageAdvert = function (idAdvert, path, idPhoto) {
  return new Promise(function (resolve, reject) {
    Advert.findOneAndUpdate({_id: idAdvert}, {
      $set: {
      imagePath: path,
      imageName: idPhoto
      }
    }, { new: true }, function (err, doc) {
    if (!err) {
      resolve(doc);
    } else {
      reject({ message: "Error saving image" });
    }
    });
  });
}

exports.deleteImageAdvert = function(id) {
  return new Promise(function (resolve, reject) {
    Advert.findOneAndUpdate({_id:id},  {
      $set: {
      imagePath: null,
      imageName: null
      }
    }, { new: true }, function (err, doc) {
    if (!err) {
      resolve(doc);
    } else {
      reject({ message: "Error deleting image" });
    }
  });
  });
}

exports.getImagePathAdvert = function(id) {
  return new Promise(function (resolve, reject) {
    Advert.findOne({_id:id}, function (err, advert) {
      if (err) {
        console.log("Error finding advert", id);
        reject(err);
      }
      else {
        resolve(advert.imagePath);
      }
    })
  });
}

exports.getImageNameAdvert = function(id) {
  return new Promise(function (resolve, reject) {
    Advert.findOne({_id:id}, function (err, advert) {
      if (err) {
        console.log("Error finding advert", id);
        reject(err);
      }
      else {
        resolve(advert.imageName);
      }
    })
  });
}

exports.saveAdvert = function (advertData) {
  var advert = new Advert(advertData);
  return new Promise((resolve, reject) => {
    advert.save()
      .then(advertCreated => {
        resolve(advertCreated);
      }).catch(err => {
        console.log("Error saving advert" + err.message)
        reject(err);
      });
  });
}

exports.deleteAdvert = function (id) {
  return new Promise(function (resolve, reject) {
    inscriptionDB.deleteInscriptionByAdvertId(id).then(cb => {
      Advert.deleteOne({ _id: id }, function (err) {
        if (!err) {
          resolve({message: "Advert deleted"});
        } else {
          reject({message: "Error deleting advert"});
        }
      });
    }).catch(err => {
      reject(err);
    });
  });
}

exports.deleteAdvertByUserId = function (userId) {
  return new Promise(function (resolve, reject) {
    Advert.find({ userId: userId }, function (err, adverts) {
      if (err) reject(err);
      if (adverts.length > 0) {
        var itemsProcessed = 0;
        adverts.forEach((element, index, array) => {
          inscriptionDB.deleteInscriptionByAdvertId(element._id).then(cb => {
            itemsProcessed++;
            if (itemsProcessed == array.length) {
              Advert.deleteMany({ userId: userId }, function (err) {
                if (err) {
                  reject(err);
                } else {
                  resolve({ message: "Adverts deleted" });
                }
              });
            }
          }).catch(err => {
            reject(err);
          });
        })
      } else {
        resolve([]);
      }
    });
  });
}

exports.modifyStateAdvert = function (id, state) {
  return new Promise(function (resolve, reject) {
    var validValues = ['opened', 'closed'];
    if (validValues.indexOf(state) == -1) {
      reject({ message: "state no válido" });
    } else {
      Advert.findByIdAndUpdate(id, { $set: { state: state } },{new: true}, function (err, advert) {
        if (err) {
          reject(err);
        }
        if(state == 'closed'){
          inscriptionDB.closeInscriptions(id).then(allInscriptions => {
            resolve(advert);
          }).catch(err => {
            reject(err);
          });
        }else{
          resolve(advert);
        }
      });
    }
  });
}

exports.modifyAdvert = function (advert, content) {
  return new Promise(function (resolve, reject) {
    if (!content.date) {
      content.date = advert.date;
    }
    if (!content.title) {
      content.title = advert.title;
    }
    if (!content.description) {
      content.description = advert.description;
    }
    if (!content.places) {
      content.places = advert.places;
    }
    if (!content.location) {
      content.location = advert.location;
    }
    Advert.findOneAndUpdate({ _id: advert._id }, {
      $set: {
        date: content.date, title: content.title, location: content.location,
        description: content.description, places: content.places, state: "opened"
      }
    }, { new: true },
      function (err, doc) {
        if (!err) {
          resolve(doc);
        } else {
          reject({ message: "Error modifying advert" });
        }
      });
  });
}

exports.findAdvertById = function (idAdvert) {
  return new Promise(function (resolve, reject) {
    if (idAdvert.match(/^[0-9a-fA-F]{24}$/)) {
      Advert.findOne({
        _id: idAdvert
      }, function (err, advert) {
        if (err) {
          console.log("Error finding advert", idAdvert);
          reject(err);
        }
        resolve(advert);
      });
    } else {
      reject({ message: "AdvertId invalid" });
    }
  });
}

exports.getOneAdvert = function(advertId) {
  return new Promise((resolve, reject) => {
    Advert.findOne({_id: advertId},function (err, advert) {
      if (err) {
        reject(err)
      }
      addUserToOneAdvert(advert).then(advertFull => {
        console.log(advertFull);
        resolve(advertFull);
      }).catch(err => {
        reject(err);
      })
    });
  })
}

exports.getAdvert = function (types) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(types)) {
      var error = { message: "Types tiene que ser un array" };
      reject(error);
    }
    if (types.length > 0) {
      var typesQuery = [];
      types.forEach(element => {
        typesQuery.push({ typeAdvert: element });
      });
      Advert.find({ $or: typesQuery }, (err, advert) => {
        if (err) {
          console.log("Error finding adverts with this types", err);
          reject(err);
        }
        addUsersToAdvert(advert).then(added => {
          // var addedCopy = JSON.parse(JSON.stringify(added));
          // addedCopy.sort(function (a, b) {
          //   return new Date(b.createdAt) - new Date(a.createdAt);
          // });
          resolve(added);
        });
      });
    } else {
      Advert.find({}, (err, advert) => {
        if (err) {
          console.log("Error finding all adverts", err);
          reject(err);
        }
        // console.log("Adverts:", advert);
        addUsersToAdvert(advert).then(added => {
          // console.log("RESULTI:", added);
          // var sendForums = JSON.parse(JSON.stringify(added));
          // sendForums.sort(function (a, b) {
          //   return new Date(b.createdAt) - new Date(a.createdAt);
          // });
          // console.log("--> ", sendForums);
          resolve(added);
        });
      });
    }
  })
}


addUserToOneAdvert = function (advert) {
  return new Promise((resolve, reject) => {
    var advertToSent = JSON.parse(JSON.stringify(advert));
    usersDB.findUserById(advert.userId).then(user => {
      advertToSent['user'] = JSON.parse(JSON.stringify(user));
      if (user) {
        advertToSent['user'].password = undefined;
      }
      resolve(advertToSent);
    }).catch(err => {
      reject(err);
    });
  })
}

addUsersToAdvert = function (adverts) {
  return new Promise((resolve, reject) => {
    if (adverts.length > 0) {
      var advertArray = [];
      var itemsProcessed = 0;
      adverts.forEach((item, index, array) => {
        var advertToSent = JSON.parse(JSON.stringify(item));
        usersDB.findUserById(item.userId).then(user => {
          advertToSent['user'] = JSON.parse(JSON.stringify(user));
          if (user) {
            advertToSent['user'].password = undefined;
          }
          advertArray.push(advertToSent);
          itemsProcessed++;
          if (itemsProcessed === array.length) {
            advertArray.sort(function (a, b) {
              return new Date(b.createdAt) - new Date(a.createdAt);
            });
            // console.log("EEOO:", advertArray);
            resolve(advertArray);
          }
        }).catch(err => {
          reject(err);
        });
      });
    } else {
      resolve(adverts);
    }
  });
}

getRegistereds = function (advert) {
  return new Promise(function (resolve, reject) {
    var inscriptionsToSent = [];
    var arrayNew = [];
    inscriptionDB.findInscriptionsAdvert(advert._id).then(ins => {
      if (ins.length == 0) {
        inscriptionsToSent = JSON.parse(JSON.stringify(arrayNew));
        resolve(inscriptionsToSent);
      }
      else {
        var itemsProcessed = 0;
        ins.forEach((item, index, array) => {
          usersDB.findUserById(item.userId).then(user => {
            var aux = { id: item._id, "userId": item.userId, "username": user.username, "status": item.status };
            arrayNew.push((aux));
            ++itemsProcessed;
            if (itemsProcessed === array.length) {
              advertToSent = JSON.parse(JSON.stringify(arrayNew));
              resolve(advertToSent);
            }
          }).catch(err => {
            reject(err);
          });
        });
      }
    });
  });
}

exports.getOneFullAdvert = function (advert) {
  return new Promise((resolve, reject) => {
    var advertToSent = JSON.parse(JSON.stringify(advert));
    getRegistereds(advert).then(regs => {
      advertToSent['registered'] = JSON.parse(JSON.stringify(regs))
      resolve(advertToSent);
    }).catch(err => {
      reject(err);
    });
  });
}

exports.getFullAdvert = function (adverts) {
  return new Promise((resolve, reject) => {
    if (adverts.length > 0) {
      var advertArray = [];
      var itemsProcessed = 0;
      adverts.forEach((item, index, array) => {
        var advertToSent = JSON.parse(JSON.stringify(item));
        getRegistereds(item).then(regs => {
          advertToSent['registered'] = JSON.parse(JSON.stringify(regs))
          reportDB.findNumReports(item._id, 'advert').then(numReports => {
            advertToSent['numReports'] = numReports;
            advertArray.push(advertToSent);
            itemsProcessed++;
            if (itemsProcessed === array.length) {
              resolve(advertArray);
            }
          }).catch(err => {
            reject({message: "ha habido un error al contar los reports: " + err.message});
          });
        }).catch(err => {
          reject(err);
        });
      });
    } else {
      resolve(adverts);
    }
  });
}

exports.getAdvertsWithRegistered = function (advert) {
  return new Promise(function (resolve, reject) {
    var arrayNew = [];
    var advertToSent = JSON.parse(JSON.stringify(advert));
    inscriptionDB.findInscriptionsAdvert(advert._id).then(ins => {
      if (ins.length == 0) {
        advertToSent['registered'] = JSON.parse(JSON.stringify(arrayNew));
        resolve(advertToSent);
      }
      else {
        var itemsProcessed = 0;
        ins.forEach((item, index, array) => {
          usersDB.findUserById(item.userId).then(user => {
            var aux = { "userId": item.userId, "username": user.username, "status": item.status };
            arrayNew.push((aux));
            ++itemsProcessed;
            if (itemsProcessed === array.length) {
              advertToSent['registered'] = JSON.parse(JSON.stringify(arrayNew));
              resolve(advertToSent);
            }
          }).catch(err => {
            reject(err);
          });
        });
      }
    }).catch(err => {
      reject(err);
    });
  });
}

exports.solveInscriptionAdvertUser = function (idAdvert, idUser, newStatus) {
  return new Promise(function (resolve, reject) {
    Advert.findOneAndUpdate({ _id: idAdvert, "registered.userId": idUser }, {
      $set: {
        "registered.$.status": newStatus
      }
    }, { new: true },
      function (err, doc) {
        if (!err) {
          resolve(doc);
        } else {
          reject({ message: "Error modifying advert" });
        }
      });
  })
}


exports.findAdvertByIdUser = function (userId) {
  return new Promise(function (resolve, reject) {
    Advert.find({ userId: userId }, function (err, advert) {
      if (err) {
        console.log("Error finding advert", userId);
        reject(err);
      }
      resolve(advert);
    });
  });
}

exports.addRegisteredUser = function (advertId, user, state) {
  var register = { userId: user._id, username: user.username, status: state };
  return new Promise(function (resolve, reject) {
    Advert.findOne({ _id: advertId }, function (err, advert) {
      if (err) {
        console.log("Error finding advert", advertId);
        reject(err);
      }
      else {
        Advert.updateOne({
          _id: advertId
        }, { $push: { registered: register } },
          function (err, advert) {
            if (err) {
              console.log("Error updating advert", advertId);
              reject(err);
            }
            else resolve(advert);
          });
      }
    });
  });
}