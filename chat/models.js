var mongoose = require('mongoose');

/**
* @swagger
* definitions:
*   Chat:
*     required:
*       - content
*       - newTo
*       - newFrom
*       - from
*       - to
*       - createdAt
*     properties:
*       _id:
*         type: string
*       content:
*         type: string
*       newTo:
*         type: boolean
*       newFrom:
*         type: boolean
*       from:
*         type: string
*         description: userId
*       to:
*         type: string
*         description: userId
*       createdAt: 
*         type: string
*/


/**
* @swagger
* definitions:
*   NewMessages:
*     required:
*       - new
*     properties:
*       new:
*         type: number
*/

var ChatSchema = new mongoose.Schema({
  newFrom: Boolean,
  newTo: Boolean,
  content: String,
  fromUsername: String,
  from: String,
  toUsername: String,
  to: String,
  createdAt: String
});

exports.ChatSchema = ChatSchema;
