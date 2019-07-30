var mongoose = require('mongoose');

/**
 * @swagger
 * definitions:
 *   AdvertFailed:
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
*   Advert:
*     required:
*       - date
*       - title
*       - description
*       - places
*       - typeAdvert
*     properties:
*       id:
*         type: string
*       userId:
*         type: string
*       createdAt:
*         type: string
*       date:
*         type: string
*       state:
*         type: string
*         enum: [opened, closed]
*       title:
*         type: string
*       description:
*         type: string
*       places:
*         type: number
*       location:
*         $ref: "#/definitions/Location"
*       premium:
*         type: boolean
*       typeUser:
*         type: string
*         enum: [voluntary, admin, newComer, association]
*       typeAdvert:
*         type: string
*         enum: [lookFor, offer]
*       imagePath:
*         type: string
*       imageName:
*         type: string
*/

/**
* @swagger
* definitions:
*   AdvertRegistered:
*     required:
*       - date
*       - title
*       - description
*       - places
*       - typeAdvert
*     properties:
*       id:
*         type: string
*       userId:
*         type: string
*       createdAt:
*         type: string
*       date:
*         type: string
*       state:
*         type: string
*         enum: [opened, closed]
*       title:
*         type: string
*       description:
*         type: string
*       places:
*         type: number
*       location:
*         $ref: "#/definitions/Location"
*       premium:
*         type: boolean
*       typeUser:
*         type: string
*         enum: [voluntary, admin, newComer, association]
*       typeAdvert:
*         type: string
*         enum: [lookFor, offer]
*       imagePath:
*         type: string
*       imageName:
*         type: string
*       registered:
*         type: array
*         items:
*           $ref: "#/definitions/Inscription"
*/

/**
* @swagger
* definitions:
*   AdvertResponse:
*     required:
*       - date
*       - title
*       - description
*       - places
*       - typeAdvert
*     properties:
*       id:
*         type: string
*       userId:
*         type: string
*       createdAt:
*         type: string
*       date:
*         type: string
*       state:
*         type: string
*         enum: [opened, closed]
*       title:
*         type: string
*       description:
*         type: string
*       places:
*         type: number
*       premium:
*         type: boolean
*       location:
*         $ref: "#/definitions/Location"
*       typeUser:
*         type: string
*         enum: [voluntary, admin, newComer, association]
*       typeAdvert:
*         type: string
*         enum: [lookFor, offer]
*       user:
*         $ref: "#/definitions/User"
*       numReports:
*         type: number
*       registered:
*         type: array
*         items:
*           $ref: "#/definitions/Inscription"
*       imagePath:
*         type: string
*       imageName:
*         type: string
*/

/**
 * @swagger
 * definitions:
 *   ImageBodyAdvert:
 *     properties:
 *       url:
 *         type: string
 *       public_id:
 *         type: string
 */

/**
* @swagger
* definitions:
*   AdvertBody:
*     required:
*       - date
*       - title
*       - description
*       - places
*       - typeAdvert
*     properties:
*       date:
*         type: string
*       title:
*         type: string
*       description:
*         type: string
*       location:
*         $ref: "#/definitions/Location"
*       places:
*         type: number
*       typeAdvert:
*         type: string
*         enum: [lookFor, offer]
*/

/**
* @swagger
* definitions:
*   ModifAdvertBody:
*     properties:
*       date:
*         type: string
*       title:
*         type: string
*       description:
*         type: string
*       places:
*         type: number
*       location:
*         $ref: "#/definitions/Location"
*/

/**
* @swagger
* definitions:
*   ModifStateBody:
*     properties:
*       state:
*         type: string
*         enum: [opened, closed]
*/

/**
* @swagger
* definitions:
*   Location:
*     properties:
*       lat:
*         type: number
*       lng:
*         type: number
*/


var AdvertSchema = new mongoose.Schema({
  userId: String,
  createdAt: String,
  date: String,
  state: {
    type: String,
    enum: ['opened', 'closed'],
    default: 'opened'
  },
  title: String,
  description: String,
  places: Number,
  premium: Boolean,
  typeUser: {
    type: String,
    enum: ['voluntary', 'admin', 'newComer', 'association']
  },
  typeAdvert: {
    type: String,
    enum: ['lookFor', 'offer'],
    default: 'offer'
  },
  location: {
    lat: Number,
    lng:  Number
  },
  imagePath: String,
  imageName: String
});

exports.AdvertSchema = AdvertSchema;