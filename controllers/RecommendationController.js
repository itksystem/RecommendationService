const common       = require('openfsm-common');  /* Библиотека с общими параметрами */
const CommonFunctionHelper = require("openfsm-common-functions")
const commonFunction= new CommonFunctionHelper();
const RecoHelper = require('../helpers/RecommendationHelper');  /* Библиотека с общими параметрами */
const authMiddleware = require('openfsm-middlewares-auth-service');
const logger = require('openfsm-logger-handler');
const { v4: uuidv4 } = require('uuid'); 
const AuthServiceClientHandler = require("openfsm-auth-service-client-handler");
const authClient = new AuthServiceClientHandler();              // интерфейс для  связи с MC AuthService

require('dotenv').config();


const sendResponse = (res, statusCode, data) => {
    if(statusCode >= 400)
         logger.error(data);
    res.status(statusCode).json(data);
};



/*
 @input req/req - 
 @output profile
   200 - создан
   400 - оршибка данных
   422 - ошибка процесса
   500 - серверная ошибка
*/

exports.getLike = async (req, res) => {          
    try {
        let userId = await authMiddleware.getUserId(req, res);
        let productId = req.params.productId;
        if(!userId || !productId) throw(422);               
        let likes = await RecoHelper.getProductLikes(productId);
        let like = await RecoHelper.getLike(userId);
        sendResponse(res, 200, { status: like, likes });
       } catch (error) {
        sendResponse(res, (Number(error) || 500), { code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
    }
};

/*
 @input body - параметры клиента
 @output result
   200 - создан
   400 - оршибка данных
   422 - ошибка процесса
   500 - серверная ошибка
*/

exports.setLike = async (req, res) => {          
    try {
        let userId = await authMiddleware.getUserId(req, res);
        let {productId, status} = req.body;
        if(!userId || !productId ) throw(422);               
        let result = await RecoHelper.setLike(productId, userId, status);
        sendResponse(res, 200, { status });
       } catch (error) {
        sendResponse(res, (Number(error) || 500), { code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
    }
};