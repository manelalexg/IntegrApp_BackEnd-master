var mongoose = require('mongoose');

/**
 * @swagger
 * definitions:
 *   InscriptionFailed:
 *     properties:
 *       success:
 *         type: boolean
 *       message:
 *         type: string
 */

/**
 * @swagger
 * definitions:
 *   Error:
 *     properties:
 *       message:
 *         type: string
 */

 /**
* @swagger
* definitions:
*   Inscription:
*     required:
*       - userId
*       - advertId
*     properties:
*       _id:
*         type: string
*       userId:
*         type: string
*       username:
*         type: string
*       advertId:
*         type: string
*       status:
*         type: string
*         enum: [pending, refused, completed, accepted]
*/

/**
* @swagger
* definitions:
*   ResponseGetInscriptions:
*     required:
*       - advert
*       - inscriptions
*     properties:
*       advert:
*         $ref: "#/definitions/Advert"
*       inscriptions:
*         type: array
*         items: 
*           $ref: "#/definitions/InscriptionWithUser"
*/

/**
* @swagger
* definitions:
*   InscriptionWithUser:
*     required:
*       - userId
*       - advertId
*     properties:
*       _id:
*         type: string
*       userId:
*         type: string
*       advertId:
*         type: string
*       status:
*         type: string
*         enum: [pending, refused, completed, accepted]
*       user:
*         type: string
*         $ref: "#/definitions/UserInfo"
*/

/**
* @swagger
* definitions:
*   InscriptionBody:
*     required:
*       - userId
*       - advertId
*     properties:
*       userId:
*         type: string
*       advertId:
*         type: string
*/

/**
* @swagger
* definitions:
*   InscriptionInfo:
*     required:
*       - userId
*       - advertId
*     properties:
*       userId:
*         type: string
*       advertId:
*         type: string
*/

/**
* @swagger
* definitions:
*   SolveInscriptionBody:
*     properties:
*       userId:
*         type: string
*       status:
*         type: string
*         enum: [pending, refused, completed, accepted]
*/

var InscriptionSchema = new mongoose.Schema({
    inscriptionId: String,
    userId: String,
    username: String,
    advertId: String,
    status: {
      type: String,
      enum: ['pending', 'refused', 'completed', 'accepted'],
      default: 'pending'
    }
  });
  
  exports.InscriptionSchema = InscriptionSchema;