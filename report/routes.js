var controller = require('./controller');
var express = require('express');
var tokenMiddleware = require ('../middleware/tokenVerification');

var apiRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Report
 *   description: Reports de l'aplicació
 */

/**
 * @swagger
 * /report:
 *   post:
 *     summary: Fer un report d'una publicació
 *     tags: [Report]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters: 
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: "#/definitions/ReportBody"
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/Report"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */

apiRoutes.post('/report', tokenMiddleware.tokenCheck, controller.createReport);

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Retorna els reports
 *     tags: [Report]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters: 
 *       - name: type
 *         in: query
 *         type: array
 *         description: Tipus de reports
 *         items:
 *           type: string
 *           enum: [user, advert, forum]
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/Report"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.get('/reports', tokenMiddleware.tokenCheck, controller.getReports);

exports.apiRoutes = apiRoutes;