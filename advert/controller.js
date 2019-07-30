/**
 * Controller of advert
 */
var jwt = require('jsonwebtoken');
var config = require('config'); // get our config file
var advertDB = require('./advertDB');
var userDB = require('../users/usersDB');
var fs = require('fs');
var cloudinary = require('cloudinary');
var upload = require('express-fileupload');

var array = ["image/jpeg", "image/png"];

cloudinary.config({
  cloud_name: 'hlcivcine',
  api_key: '158434689396546',
  api_secret: 'LfgGuWmq3OGj-2HmYTo0p7Xa5CE'
})

exports.advertImage = function (req, res, next) {
  if (!req.body.url || !req.body.public_id) {
    res.status(400).json({ message: "Debes enviar url y public_id de la imagen en cloudinary" });
    return;
  }

  else {
    advertDB.findAdvertById(req.params.advertId).then(advert => {
      if (advert.userId != req.decoded.userID) {
        res.status(400).json({ message: "L'usuari no és el propietari de l'anunci!" });
      }
      else {
        advertDB.getImageNameAdvert(req.params.advertId).then(image => {
          if (image != null) {
            cloudinary.v2.uploader.destroy(image, { folder: "adverts" }, function (error, result) {
              if (error) {
                res.status(400).json({ error });
              }
            })
            advertDB.uploadImageAdvert(req.params.advertId, req.body.url, req.body.public_id).then(advertFile => {
                  res.send(advertFile);
            }).catch(err => {
              res.status(400).json({ message: err.message });
            });
          }

          else {
            advertDB.uploadImageAdvert(req.params.advertId, req.body.url, req.body.public_id).then(advertFile => {
              res.send(advertFile);
            }).catch(err => {
              res.status(400).json({ message: err.message });
            });
          }
        }).catch(err => {
          res.status(400).json({ message: err.message });
        });
      }
    }).catch(err => {
      res.status(400).json({ message: err.message });
    });
  }
}

exports.advertImageFromBack = function (req, res, next) {
  if (!req.files.file) {
    res.status(400).json({ message: "Falta la imagen" });
    return;
  }

  else if (array.indexOf(req.files.file.mimetype) < 0) {
    res.status(400).json({ message: "Imagen tiene que ser en formato JPEG o PNG." });
    return;
  }

  else {
    console.log("req.:", req.body);
    advertDB.findAdvertById(req.params.advertId).then(advert => {
      if (advert.userId != req.decoded.userID) {
        res.status(400).json({ message: "L'usuari no és el propietari de l'anunci!" });
      }
      else {
        advertDB.getImageNameAdvert(req.params.advertId).then(image => {
          if (image != null) {
            cloudinary.v2.uploader.destroy(image, { folder: "adverts" }, function (error, result) {
              if (error) {
                res.status(400).json({ error });
              }
            })
            let sampleFile = req.files.file;
            sampleFile.mv('./images/' + sampleFile.name, function (err) {
              if (err) {
                res.status(400).json({ err });
              }
              else {
                cloudinary.v2.uploader.upload('./images/' + sampleFile.name, { folder: "adverts" }, function (error, result) {
                  if (error) {
                    res.status(400).json({ error });
                  }
                  else {
                    advertDB.uploadImageAdvert(req.params.advertId, result.url, result.public_id).then(advertFile => {
                      fs.unlink('./images/' + sampleFile.name, function (error) {
                        if (error) {
                          throw error;
                        }
                        else {
                          res.send(advertFile);
                        }
                      })
                    }).catch(err => {
                      res.status(400).json({ message: err.message });
                    });
                  }
                })
              }
            });
          }

          else {
            let sampleFile = req.files.file;
            sampleFile.mv('./images/' + sampleFile.name, function (err) {
              if (err) {
                res.status(400).json({ err });
              }
              else {
                cloudinary.v2.uploader.upload('./images/' + sampleFile.name, { folder: "adverts" }, function (error, result) {
                  if (error) {
                    res.status(400).json({ error });
                  }
                  else {
                    advertDB.uploadImageAdvert(req.params.advertId, result.url, result.public_id).then(advertFile => {
                      fs.unlink('./images/' + sampleFile.name, function (error) {
                        if (error) {
                          throw error;
                        }
                        else {
                          res.send(advertFile);
                        }
                      });

                    }).catch(err => {
                      res.status(400).json({ message: err.message });
                    });
                  }
                });
              }
            });
          }
        }).catch(err => {
          res.status(400).json({ message: err.message });
        });
      }
    }).catch(err => {
      res.status(400).json({ message: err.message });
    });
  }
}

exports.advertDeleteImage = function (req, res, next) {
  if (!req.params.advertId) {
    res.status(400).json({ message: "Falta el advertId" });
  }
  else {
    advertDB.getImageNameAdvert(req.params.advertId).then(image => {
      if (image == null) {
        res.status(400).json({ message: "The advert has no image." });
      }
      else {
        console.log(image);
        advertDB.deleteImageAdvert(req.params.advertId).then(del => {
          cloudinary.v2.uploader.destroy(image, { folder: "adverts" }, function (error, result) {
            if (error) {
              res.status(400).json({ error });
            }
            else res.send("Image deleted");
          })
        }).catch(err => {
          res.status(400).json({ message: err.message });
        })
      }
    }).catch(err => {
      res.status(400).json({ message: err.message });
    })
  }
}

exports.advertGetImage = function (req, res, next) {
  advertDB.getImagePathAdvert(req.params.advertId).then(image => {
    if (image == null) {
      res.status(400).json({ message: "The advert has no image." });
    }
    else {
      res.send(image);
    }
  }).catch(err => {
    res.status(400).json({ message: err.message });
  })
}

exports.createAdvert = function (req, res, next) {
  verifyFieldAdvert(req.body, req.decoded).then(verif => {
    var advertDocument = createAdvertDocument(req.body, verif, req.decoded);

    advertDB.saveAdvert(advertDocument)
      .then(advert => {
        res.send(advert);
      }).catch(err => {
        res.status(400).json({ message: "Ha habido un error en la creación del anuncio :" + err.message })
      });

  }).catch(err => {
    res.status(400).json({ message: err.message });
  });
}

exports.getAdvertId = function (req, res, next) {
  advertDB.findAdvertById(req.params.id).then(ad => {
    if (ad != null) {
      advertDB.getOneAdvert(req.params.id).then(advert => {
        advertDB.getOneFullAdvert(advert).then(fullAdd => {
          res.send(fullAdd);
        }).catch(err => {
          res.status(400).json({ message: err.message });
        });
      }).catch(err => {
        res.status(400).json({ message: err.message });
      });
    }
    else {
      res.status(400).json({ message: "No existe ningún advert con este ID" });
    }
  }).catch(err => {
    res.status(400).json({ message: err.message });
  });

}

exports.getAdverts = function (req, res, next) {
  var types = req.query.type;
  var typesToGet = [];
  if (types != undefined) {
    typesToGet = types.split(',');
    typesToGet = typesToGet.filter(Boolean);
    var types = verifyTypeAdvert(typesToGet);
    if (!types) {
      res.status(400).json({ message: "Tipo no válido." });
      return;
    }
  }


  advertDB.getAdvert(typesToGet).then(adverts => {
    advertDB.getFullAdvert(adverts).then(full => {
      // console.log("FULL:", full);
      res.send(full);
    }).catch(err => {
      // console.log("Primer err", err);
      res.status(400).json({ message: err.message });
    });

  }).catch(err => {
    res.status(400).json({ message: err.message });
  })
}

exports.deleteAdvert = function (req, res, next) {
  advertDB.findAdvertById(req.params.id).then(advert => {
    advertDB.deleteAdvert(advert._id).then(deletedMessage => {
      res.send({ message: deletedMessage.message });
    }).catch(err => {
      res.status(400).json({ message: err.message });
    });
  }).catch(err => {
    res.status(400).json({ message: err.message });
  })
}

exports.modifyStateAdvert = function (req, res, next) {
  advertDB.findAdvertById(req.params.id).then(advert => {
    var stateToModify = req.body.state;
    advertDB.modifyStateAdvert(advert._id, stateToModify).then(modified => {
      res.send(modified);
    }).catch(err => {
      res.status(400).json({ message: err.message });
    });
  }).catch(err => {
    res.status(400).json({ message: err.message });
  })
}

exports.getAdvertsUser = function (req, res, next) {
  advertDB.findAdvertByIdUser(req.params.id).then(adverts => {
    if (!adverts) {
      res.status(400).json({ message: "Error with user" });
    } else {
      advertDB.getFullAdvert(adverts).then(full => {
        res.send(full);
      }).catch(err => {
        res.status(400).send(err);
      });
    }
  }).catch(err => {
    res.status(400).send(err);
  });
}

exports.modifyAdvert = function (req, res, next) {
  var advertData = req.body;
  verifyFieldAdvertModify(advertData, req.decoded, req.params.id).then(data => {
    return advertDB.findAdvertById(req.params.id);
  }).then(advert => {
    advertDB.modifyAdvert(advert, advertData).then(doc => {
      res.send(doc);
    }).catch(err => {
      res.status(400).json({ message: err.message });
    });
  }).catch(err => {
    res.status(400).json(err);
  })
}

notImplemented = function (req, res, next) {
  res.status(501).json({ message: "Function not implemented" });
}

verifyFieldAdvert = function (advertData, decoded) {
  return new Promise((resolve, reject) => {
    var validTypes = ["lookFor", "offer"];
    if (advertData.places <= 0) {
      reject({ message: "places tiene que ser mayor que 0" });
    }
    if (!advertData.date || !advertData.title || !advertData.description || !advertData.places || !advertData.typeAdvert) {
      reject({ message: "Faltan datos obligatorios: date, title, description, places, typeAdvert" });
    }
    if (validTypes.indexOf(advertData.typeAdvert) == -1) {
      reject({ message: "type tiene que ser uno o varios de estos valores: [lookFor, offer]" });
    }

    if (advertData.hasOwnProperty('location')) {
      if (!advertData.location.hasOwnProperty('lat') || !advertData.location.hasOwnProperty('lng')) {
        reject({ message: "La localización tiene que tener 'lat' y 'lng'" })
      }
    }

    var regex = /^\d\d\d\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01]) (00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])$/;

    if (!regex.test(advertData.date)) {
      reject({ message: "Date tiene que ser en formato YYYY-MM-DD hh:mm:ss" });
    }
    var dataAux = new Date(advertData.date).toLocaleString();
    dataAux = new Date(dataAux).getTime();


    var today = new Date();
    today.setHours(today.getHours() + 2);
    today.toLocaleString();
    today = new Date(today).getTime();


    if (dataAux - today < 0) {
      reject({ message: "Date tiene que ser posterior a la date actual" });
    }

    userDB.findUserById(decoded.userID).then(res => {
      if (res == null) {
        reject({ message: "El usuario no existe" });
      } else {
        resolve({ user: res });
      }
    }).catch(err => {
      reject({ message: "Ha habido un error: " + err.message });
    })
  });
}

verifyFieldAdvertModify = function (advertData, decoded, advertId) {
  return new Promise((resolve, reject) => {
    if (advertData.places) {
      if (advertData.places <= 0) {
        reject({ message: "places tiene que ser mayor que 0" });
      }
    }
    var regex = /^\d\d\d\d-(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01]) (00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9])$/;
    if (advertData.date) {
      if (!regex.test(advertData.date)) {
        reject({ message: "Date tiene que ser en formato YYYY-MM-DD hh:mm:ss" });
      }
      var dataAux = new Date(advertData.date).toLocaleString();
      dataAux = new Date(dataAux).getTime();

      var today = new Date();
      today.setHours(today.getHours() + 2);
      today.toLocaleString();
      today = new Date(today).getTime();


      if (dataAux - today < 0) {
        reject({ message: "Date tiene que ser posterior a la date actual" })
      }
    }

    if (advertData.hasOwnProperty('location')) {
      if (!advertData.location.hasOwnProperty('lat') || !advertData.location.hasOwnProperty('lng')) {
        reject({ message: "La localización tiene que tener 'lat' y 'lng'" });
      }
    }

    userDB.findUserById(decoded.userID).then(res => {
      if (res == null) {
        reject({ message: "El usuario no existe" });
      } else {
        advertDB.findAdvertById(advertId).then(advertDoc => {
          if (advertDoc.userId == decoded.userID) {
            resolve({ success: true });
          } else {
            reject({ message: "No eres el propietario de este anuncio." });
          }
        });
      }
    }).catch(err => {
      reject({ message: "Ha habido un error: " + err.message });
    });
  });
}

createAdvertDocument = function (advertData, user, decoded) {
  var advert = {};
  advert['userId'] = decoded.userID;
  var today = new Date();
  today.setHours(today.getHours() + 2);
  today = today.toLocaleString();
  advert['createdAt'] = today;
  advert['date'] = new Date(advertData.date).toLocaleString();
  advert['state'] = "opened";
  advert['title'] = advertData.title;
  advert['description'] = advertData.description;
  advert['places'] = advertData.places;
  advert['location'] = advertData.location;
  if (user.user.type == "association") advert['premium'] = true;
  else advert['premium'] = false;
  advert['typeUser'] = user.user.type;
  advert['typeAdvert'] = advertData.typeAdvert;
  return advert;
}

verifyTypeAdvert = function (typesToVerify) {
  var validTypes = ["lookFor", "offer"];
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