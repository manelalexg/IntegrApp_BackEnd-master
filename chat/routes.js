

var chatController = require('./controller');
var express = require('express');
var tokenMiddleware = require('../middleware/tokenVerification');

var apiRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Endpoints per al chat
 */

/**
 * @swagger
 * /chat:
 *   get:
 *     summary: Retorna els missatges entre dos usuaris
 *     tags: [Chat]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters: 
 *       - name: from
 *         in: query
 *         type: string
 *         description: userId dels missatges del remitent
 *       - name: to
 *         in: query
 *         type: string
 *         description: userId dels missatges del destinatari
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/Chat"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.get('/chat', tokenMiddleware.tokenCheck, chatController.getChat);


/**
 * @swagger
 * /chat/{userId}:
 *   get:
 *     summary: Retorna els usuaris amb qui ha contactat un usuari
 *     tags: [Chat]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters: 
 *       - name: userId
 *         in: path
 *         type: string
 *         description: userId del usuari remitent
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/User"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.get('/chat/:id', tokenMiddleware.tokenCheck, chatController.getChatByUserId);


/**
 * @swagger
 * /newChats/{userId}:
 *   get:
 *     summary: Retorna el número de chats nous que té l'usuari
 *     tags: [Chat]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters: 
 *       - name: userId
 *         in: path
 *         type: string
 *         description: userId del usuari remitent
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/NewMessages"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.get('/newChats/:id', tokenMiddleware.tokenCheck, chatController.getNewChats);

exports.apiRoutes = apiRoutes;