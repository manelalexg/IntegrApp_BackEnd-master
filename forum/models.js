var mongoose = require('mongoose');

/**
* @swagger
* definitions:
*   Forum:
*     required:
*       - title
*       - description
*       - type
*       - userId
*     properties:
*       id:
*         type: string
*       title:
*         type: string
*       description:
*         type: string
*       createdAt:
*         type: string
*       type:
*         type: string
*         enum: [documentation, entertainment, language, various]
*       userId:
*         type: string
*       rate:
*         type: number
*/

/**
* @swagger
* definitions:
*   ForumBody:
*     required:
*       - title
*       - description
*       - type
*     properties:
*       title:
*         type: string
*       description:
*         type: string
*       type:
*         type: string
*         enum: [documentation, entertainment, language, various]
*/

/**
* @swagger
* definitions:
*   ForumVotation:
*     required:
*       - rate
*     properties:
*       rate:
*         type: number
*/

/**
* @swagger
* definitions:
*   ModifyForumBody:
*     properties:
*       title:
*         type: string
*       description:
*         type: string
*/

var ForumSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: {
    type: String,
    enum: ['documentation', 'entertainment', 'language', 'various'],
    default: 'various'
  },
  userId: String,
  createdAt: String,
  rate: Number,
  numberRates: Number
});

/**
* @swagger
* definitions:
*   ForumEntry:
*     required:
*       - createdAt
*       - userId
*       - content
*       - forumId
*     properties:
*       userId:
*         type: string
*       createdAt:
*         type: string
*       content:
*         type: string
*       forumId:
*         type: string
*/

/**
* @swagger
* definitions:
*   ForumEntryBody:
*     required:
*       - forumId
*       - content
*     properties:
*       forumId:
*         type: string
*       content:
*         type: string
*/
var ForumEntrySchema = new mongoose.Schema({
  userId: String,
  createdAt: String,
  content: String,
  forumId: String,
});


/**
* @swagger
* definitions:
*   FullForum:
*     properties:
*       forum:
*         $ref: "#/definitions/Forum"
*       numReports:
*         type: number
*       comments:
*         type: array
*         items:
*           $ref: "#/definitions/ForumEntry"
*/

exports.ForumSchema = ForumSchema;
exports.ForumEntrySchema = ForumEntrySchema;
