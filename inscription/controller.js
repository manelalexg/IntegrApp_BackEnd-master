/**
 * Controller of inscription
 */
var jwt = require('jsonwebtoken');
var config = require('config'); // get our config file
var inscriptionDB = require('./inscriptionDB');
var userDB = require('../users/usersDB');
var advertDB = require('../advert/advertDB');

exports.createInscription = function (req, res, next) {
  var inscriptionData = req.body;
  var verify = verifyFieldsInscription(inscriptionData); //verifica que existe userId y advertId
  if (!verify.success) {
    res.status(400).json({ message: verify.message });
    return;
  }

  var dataToSave = JSON.parse(JSON.stringify(inscriptionData));
  userDB.findUserById(dataToSave.userId).then(foundUser => {
    if (!foundUser) {
      res.status(400).json({ message: "Este userId no existe." });
    } else {
      dataToSave['username'] = foundUser.username;
      advertDB.findAdvertById(dataToSave.advertId).then(foundAdvert => {
        if (!foundAdvert) {
          res.status(400).json({ message: "Este advertId no existe." });
        } else {
          if (foundAdvert.userId == dataToSave.userId) {
            res.status(400).json({ message: "No puedes inscribirte a tu propio anuncio." });
          }
          else {
            inscriptionDB.existsInscriptionUserAdvert(dataToSave.userId, dataToSave.advertId).then(
              inscription => {
                if (inscription != null) {
                  res.status(400).json({ message: "El usuario ya está inscrito a este anuncio" });
                } else {
                  countAcceptedUsers(foundAdvert).then(acc => {
                    if (acc >= foundAdvert.places) {
                      var response = { message: "Número de plazas aceptadas alcanzado." }
                      res.status(400).json(response);
                    }
                    else {
                      inscriptionDB.saveInscription(dataToSave)
                        .then(inscription => {
                          res.send(inscription);
                        }).catch(err => {
                          var response = { message: err.message };
                          res.status(400).json(response);
                        });
                    }
                  }).catch(err => {
                    res.status(400).json({ message: "Error en la suma de accepted users. " + err.message });
                  });
                }
              });
          }

        }
      }).catch(err => {
        res.status(400).json({ message: "Error en verificación de identificador de advert: " + err.message });
      });
    }
  }).catch(err => {
    res.status(400).json({ message: "Error en verificación de identificador de usuario: " + err.message });
  });
}

countAcceptedUsers = function (advert) {
  return new Promise(function (resolve, reject) {
    var count = 0;
    var itemsProcessed = 0;
    inscriptionDB.findInscriptionsAdvert(advert._id).then(ins => {
      if (ins.length == 0) {
        resolve(count);
      }
      else {
        ins.forEach((item, index, array) => {
          if (item.status == "accepted") {
            ++count;
          }
          ++itemsProcessed;
          if (itemsProcessed === array.length) {
            resolve(count);
          }
        });
      }
    }).catch(err => {
      reject(err);
    });
  });

}

exports.getInscriptionsAdvert = function (req, res, next) {
  if (!req.params.advertId) {
    res.status(400).json({ message: "Es necesita un identificador per a trobar un advert." });
  }
  else if (req.params.advertId.match(/^[0-9a-fA-F]{24}$/)) {
    advertDB.findAdvertById(req.params.advertId).then(advert => {
      inscriptionDB.findInscriptionsAdvert(advert._id).then(data => {
        res.send(data);
      }).catch(err => {
        res.status(400).send(err);
      });
    }).catch(err => {
      res.status(400).send(err);
    });
  }
  else {
    res.status(400).json({ message: "advertId invalid" });
  }
}


exports.getInscriptionsUser = function (req, res, next) {
  if (!req.params.userId) {
    res.status(400).json({ message: "Es necesita un identificador per a trobar l'usuari." });
  }
  else {
    userDB.findUserById(req.params.userId).then(user => {
      if(user!=null) {
        inscriptionDB.findInscriptionsUser(req.params.userId).then(data => {
          res.send(data);
        }).catch(err => {
          res.status(400).send(err);
        });
      }
      else {
        res.status(400).json({ message: "No existeix usuari amb aquest ID"});
      }
    }).catch(err => {
      res.status(400).send(err);
    });
    
  }

}

exports.solveInscriptionUser = function (req, res, next) {
  var inscriptionData = req.body;

  var verify = verifyFieldsSolveInscription(inscriptionData, req.params.id).then(resultat => {
    userDB.findUserById(inscriptionData.userId).then(user => {
      if (user == null) {
        res.status(400).json({ message: "User doesn't exists" })
      }
      else {
        advertDB.findAdvertById(req.params.id).then(advert => {
          if (advert == null) {
            res.status(400).json({ message: "Advert doesn't exists" })
          }
          else {
            inscriptionDB.existsInscriptionUserAdvert(inscriptionData.userId, req.params.id).then(inscription => {

              if (inscription == null) {
                res.status(400).json({ message: "Inscription doesn't exists" })
              }

              else {
                if (inscription.status == inscriptionData.status) {
                  res.status(400).json({ message: "La inscripción ya está en este mismo estado" });
                }
                else if (inscriptionData.status == "accepted") {
                  countAcceptedUsers(advert).then(acc => {
                    if (acc >= advert.places) {
                      res.status(400).json({ message: "Plazas máximas aceptadas alcanzadas." })
                    }
                    else {
                      inscriptionDB.solveInscriptionUser(inscriptionData.userId, req.params.id, inscriptionData.status).then(inscription => {
                        res.send(inscription);
                      }).catch(err => {
                        res.status(400).json({ message: err.message });
                      })
                    }
                  }).catch(err => {
                    res.status(400).json({ message: "Error en la suma de accepted users: " + err.message });
                  });
                }

                else {
                  inscriptionDB.solveInscriptionUser(inscriptionData.userId, req.params.id, inscriptionData.status).then(inscription => {
                    res.send(inscription);
                  }).catch(err => {
                    res.status(400).json({ message: err.message });
                  })
                }
              }
            }).catch(err => {
              res.status(400).json({ message: err.message });
            })
          }
        }).catch(err => {
          res.status(400).json({ message: err.message });
        })
      }
    }).catch(err => {
      res.status(400).json({ message: err.message });
    })
  }).catch(err => {
    res.status(400).json({ message: err });
  })
}

exports.deleteInscription = function (req, res, next) {
  // notImplemented(req, res, next);

  if (!req.params.id) {
    res.status(400).json({ message: "Es necesita un identificador per a trobar una inscripció." });
    return;
  }

  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400).json({ message: "Id de inscripció invàlida" });
    return;
  }
  else {
    inscriptionDB.existsInscription(req.params.id).then(ins => {
      if (ins != null) {
        inscriptionDB.deleteInscription(req.params.id).then(document => {
          res.send({ message: "Inscripció eliminada", document });
        }).catch(err => {
          res.status(400).json({ message: err.message });
        });
      }
      else {
        res.status(400).json({ message: "Inscription does not exist" });
      }
    }).catch(err => {
      res.status(400).json({ message: err.message });
    });
  }
}

notImplemented = function (req, res, next) {
  res.status(501).json({ message: "Function not implemented" });
}

verifyFieldsInscription = function (inscriptionData) {
  if (!inscriptionData.userId || !inscriptionData.advertId) {
    return { success: false, message: "Faltan datos obligatorios: userId, advertId" };
  }
  return { success: true };
}

verifyFieldsSolveInscription = function (inscriptionData) {
  return new Promise(function (resolve, reject) {
    if (!inscriptionData.userId || !inscriptionData.status) {
      reject("Faltan datos obligatorios: userId, status");
    }
    var validTypes = ["pending", "refused", "completed", "accepted"];
    if (inscriptionData.status) {
      if (validTypes.indexOf(inscriptionData.status) == -1) {
        reject("type tiene que ser: [pending, refused, completed, accepted]");
      }
    }
    resolve("OK");
  });

}

