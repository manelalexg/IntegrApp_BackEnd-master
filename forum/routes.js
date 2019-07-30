
var forumController = require('./controller');
var express = require('express');
var tokenMiddleware = require('../middleware/tokenVerification');

var apiRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Forum
 *   description: Forum de la aplicació
 */

/**
 * @swagger
 * /forum:
 *   post:
 *     summary: Creació d'un forum
 *     tags: [Forum]
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
 *           $ref: "#/definitions/ForumBody"
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/Forum"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.post('/forum', tokenMiddleware.tokenCheck, forumController.createForum);

/**
 * @swagger
 * /commentForum:
 *   post:
 *     summary: Crear un comentari en el forum
 *     tags: [Forum]
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
 *           $ref: "#/definitions/ForumEntryBody"
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/ForumEntry"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.post('/commentForum', tokenMiddleware.tokenCheck, forumController.commentForum);


/**
 * @swagger
 * /forums:
 *   get:
 *     summary: Retorna els forums
 *     tags: [Forum]
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
 *         description: Tipus de forums
 *         items:
 *           type: string
 *           enum: [documentation, entertainment, language, various]
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/Forum"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.get('/forums', tokenMiddleware.tokenCheck, forumController.getForums);


/**
 * @swagger
 * /fullForum/{id}:
 *   get:
 *     summary: Retorna el forum amb tots els seus comentaris
 *     tags: [Forum]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters: 
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *         description: Id del forum
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/FullForum"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.get('/fullForum/:id', tokenMiddleware.tokenCheck, forumController.getFullForum);

/**
 * @swagger
 * /commentForum/{id}:
 *   delete:
 *     summary: Esborra un comentari del forum si es seu
 *     tags: [Forum]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters: 
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *         description: Id del comentari del forum
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/Error"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.delete('/commentForum/:id', tokenMiddleware.tokenCheck, forumController.deleteCommentforum);

/**
 * @swagger
 * /forum/{id}/vote:
 *   put:
 *     summary: Votar un forum
 *     tags: [Forum]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters: 
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *         description: Id del forum
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: "#/definitions/ForumVotation"
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/Forum"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.put('/forum/:id/vote', tokenMiddleware.tokenCheck, forumController.voteForum);

/**
 * @swagger
 * /forum/{id}:
 *   put:
 *     summary: Modificar forum
 *     tags: [Forum]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters: 
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *         description: Id del forum
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: "#/definitions/ModifyForumBody"
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/Forum"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 *       404:
 *         description: Forum not found
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: You are not the owner
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.put('/forum/:id', tokenMiddleware.tokenCheck, forumController.modifyForum);

exports.apiRoutes = apiRoutes;