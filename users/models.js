
var mongoose = require('mongoose');

/**
 * @swagger
 * securityDefinitions:
 *   user:
 *     name: x-access-token
 *     type: apiKey
 *     in: header
 */


/**
 * @swagger
 * definitions:
 *   UserRate:
 *     properties:
 *       likes:
 *         type: number
 *       dislikes:
 *         type: number
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
 *   UserBody:
 *     required:
 *       - username
 *       - password
 *       - name
 *       - type
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       phone:
 *         type: number
 *       type:
 *         type: string
 *         enum: [voluntary, admin, newComer, association]
 *       CIF:
 *         type: string
 */

/**
* @swagger
* definitions:
*   ModifUserBody:
*     properties:
*       username:
*         type: string
*       password:
*         type: string
*       name:
*         type: string
*       email:
*         type: string
*       phone:
*         type: number
*       type:
*         type: string
*         enum: [voluntary, admin, newComer, association]
*       CIF:
*         type: string
*/

/**
 * @swagger
 * definitions:
 *   LoginBody:
 *     properties:
 *       username:
 *         type: string
 *       password:
 *         type: string
 */

 /**
 * @swagger
 * definitions:
 *   ImageBody:
 *     properties:
 *       url:
 *         type: string
 *       public_id:
 *         type: string
 */

/**
* @swagger
* definitions:
*   LoginResponse:
*     properties:
*       success:
*         type: boolean
*       message:
*         type: string
*       token:
*         type: string
*/

/**
* @swagger
* definitions:
*   LoginFailed:
*     properties:
*       success:
*         type: boolean
*       message:
*         type: string
*/

/**
* @swagger
* definitions:
*   UserInfo:
*     required:
*       - username
*       - password
*       - name
*       - type
*     properties:
*       username:
*         type: string
*       name:
*         type: string
*       email:
*         type: string
*       phone:
*         type: number
*       type:
*         type: string
*         enum: [voluntary, admin, newComer, association]
*       rate:
*         $ref: "#/definitions/UserRate"
*       CIF:
*         type: string
*       numReports:
*         type: number
*/

/**
* @swagger
* definitions:
*   User:
*     required:
*       - username
*       - password
*       - name
*       - type
*     properties:
*       username:
*         type: string
*       password:
*         type: string
*       name:
*         type: string
*       email:
*         type: string
*       phone:
*         type: number
*       type:
*         type: string
*         enum: [voluntary, admin, newComer, association]
*       rate:
*         $ref: "#/definitions/UserRate"
*       CIF:
*         type: string
*       numReports:
*         type: number
*/

/**
* @swagger
* definitions:
*   UserWithAdverts:
*     required:
*       - username
*       - password
*       - name
*       - type
*     properties:
*       username:
*         type: string
*       password:
*         type: string
*       name:
*         type: string
*       email:
*         type: string
*       phone:
*         type: number
*       type:
*         type: string
*         enum: [voluntary, admin, newComer, association]
*       rate:
*         $ref: "#/definitions/UserRate"
*       CIF:
*         type: string
*       adverts:
*         type: array
*         items:
*           $ref: "#/definitions/Advert"
*       imagePath:
*         type: string
*       imageName:
*         type: string
*/
var UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, dropDups: true },
    name: String,
    password: String,
    email: String,
    phone: Number,
    type: String,
    CIF: {
        type: String,
        required: function () {
            if (this.type == "association") return true;
            else return false;
        }
    },
    imagePath: String,
    imageName: String
});

/**
* @swagger
* definitions:
*   LikeSchema:
*     properties:
*       type:
*         type: string
*       userId:
*         type: string
*       likedUser:
*         type: string
*/
var LikesSchema = new mongoose.Schema({
    type: String, //like | dislike
    userId: String,
    likedUser: String
});

exports.UserSchema = UserSchema;
exports.LikesSchema = LikesSchema;


