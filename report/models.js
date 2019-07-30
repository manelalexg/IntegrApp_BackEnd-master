var mongoose = require('mongoose');

/**
* @swagger
* definitions:
*   Report:
*     required:
*       - description
*       - userId
*       - type
*       - typeId
*     properties:
*       id:
*         type: string
*       description:
*         type: string
*       userId:
*         type: string
*       type:
*         type: string
*         enum: [user, advert, forum]
*       createdAt:
*         type: string
*       typeId:
*         type: string
*/

/**
* @swagger
* definitions:
*   ReportBody:
*     required:
*       - description
*       - type
*       - typeId
*     properties:
*       description:
*         type: string
*       type:
*         type: string
*         enum: [user, advert, forum]
*       typeId:
*         type: string
*/

var ReportSchema = new mongoose.Schema(
    {
        description: String,
        userId: String,
        type: {
            type: String,
            enum: ['user', 'advert', 'forum']
        },
        createdAt: String,
        typeId: String
    }
);

exports.ReportSchema = ReportSchema;