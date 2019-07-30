var inscriptionController = require('./controller');
var express = require('express');
var tokenMiddleware = require('../middleware/tokenVerification');

var apiRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Inscription
 *   description: Inscripcions a anuncis de la aplicació
 */

/**
* @swagger
* tags:
*   name: Not Implemented
*   description: Funció no implementada encara
*/

/**
 * @swagger
 * /inscription:
 *   post:
 *     summary: Creació d'una inscripció a un anunci
 *     tags: [Inscription]
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
 *           $ref: "#/definitions/InscriptionBody"
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/Inscription"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: Falta incloure el token
 *         schema:
 *           $ref: "#/definitions/InscriptionFailed"
 */
apiRoutes.post('/inscription', tokenMiddleware.tokenCheck, inscriptionController.createInscription);

/**
 * @swagger
 * /inscription/{advertId}:
 *   get:
 *     summary: Retorna les inscripcions a l'anunci
 *     tags: [Inscription]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters: 
 *       - name: advertId
 *         in: path
 *         type: string
 *         required: true
 *         description: identificador de l'anunci
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/ResponseGetInscriptions"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: Falta incloure el token
 *         schema:
 *           $ref: "#/definitions/InscriptionFailed"
 */
apiRoutes.get('/inscription/:advertId', tokenMiddleware.tokenCheck, inscriptionController.getInscriptionsAdvert);

/**
 * @swagger
 * /inscriptionsUser/{userId}:
 *   get:
 *     summary: Retorna les inscripcions a anuncis de l'usuari
 *     tags: [Inscription]
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
 *         required: true
 *         description: identificador de l'usuari
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/Inscription"
 *       400:
 *         description: Error
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: Falta incloure el token
 *         schema:
 *           $ref: "#/definitions/InscriptionFailed"
 */
apiRoutes.get('/inscriptionsUser/:userId', tokenMiddleware.tokenCheck, inscriptionController.getInscriptionsUser);

/**
 * @swagger
 * /inscription/{id}:
 *   delete:
 *     summary: Esborrat d'una inscription
 *     tags: [Inscription]
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
 *         description: Id de la inscription que es vol eliminar
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
 *         description: Falta incloure el token
 *         schema:
 *           $ref: "#/definitions/AdvertFailed"
 */
apiRoutes.delete('/inscription/:id',tokenMiddleware.tokenCheck, inscriptionController.deleteInscription);

/**
 * @swagger
 * /inscription/{id}:
 *   put:
 *     summary: Resoldre inscripció a un anunci
 *     tags: [Inscription]
 *     security:
 *       - user: []
 *     consumes:
 *       - "application/json"
 *     parameters:
 *       - name: id
 *         in: path
 *         type: string
 *         required: true
 *         description: Id de l'anunci que es vol resoldre inscripció
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: "#/definitions/SolveInscriptionBody"
 *     produces:
 *       - "application/json"
 *     responses:
 *       200:
 *         description: Operació executada amb éxit
 *         schema:
 *           $ref: "#/definitions/InscriptionInfo"
 *       400:
 *         description: No s'ha trobat l'anunci
 *         schema:
 *           $ref: "#/definitions/Error"
 *       403:
 *         description: No porta el token en la request
 *         schema:
 *           $ref: "#/definitions/LoginFailed"
 */
apiRoutes.put('/inscription/:id', tokenMiddleware.tokenCheck, inscriptionController.solveInscriptionUser);


exports.apiRoutes = apiRoutes;