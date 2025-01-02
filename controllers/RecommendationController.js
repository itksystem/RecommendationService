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
 @output object
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
        let like = await RecoHelper.getLike(userId,productId);
        console.log(productId,like,likes);
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
        let {status} = req.body;
        let productId = req.params.productId;
        if(!userId || !productId ) throw(422);               
        let result = await RecoHelper.setLike(productId, userId, status);
        sendResponse(res, 200, { status });
       } catch (error) {
        sendResponse(res, (Number(error) || 500), { code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
    }
};



exports.getRating = async (req, res) => {          
    try {
        let userId = await authMiddleware.getUserId(req, res);
        let productId = req.params.productId;
        if(!userId || !productId) throw(422);               
        let rating = await RecoHelper.getRating(productId);
        console.log(productId,rating);
        sendResponse(res, 200, { status: true, rating : Number(rating).toFixed(1)});	
       } catch (error) {
        sendResponse(res, (Number(error) || 500), { code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
    }
};


exports.getReviewCount = async (req, res) => {          
    try {
        let userId = await authMiddleware.getUserId(req, res);
        let productId = req.params.productId;
        if(!userId || !productId) throw(422);               
        let reviewCount = await RecoHelper.getReviewCount(productId);
        sendResponse(res, 200, { status: true, reviewCount : Number(reviewCount)});	
       } catch (error) {
        sendResponse(res, (Number(error) || 500), { code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
    }
};

exports.getReviews = async (req, res) => {          
    try {
        let userId = await authMiddleware.getUserId(req, res);
        let productId = req.params.productId;
        if(!userId || !productId) throw(422);               
	console.log(productId, userId); 
        let reviews = await RecoHelper.getReviews(productId);
	 const itemsWithMedia = await Promise.all( // Асинхронно загружаем медиафайлы для каждого продукта
	    reviews.map(async (item) => {
	        try { // Загружаем медиафайлы для продукта          
		  console.log(item);
	          let mediaTtems = await await RecoHelper.getReviewImages(item.product_id, item.user_id ); 
	          item.mediaFiles=[];
	  	  await Promise.all( // Асинхронно загружаем медиафайлы для каждого продукта
		    mediaTtems.map(async (image) => {
		        try { // Загружаем медиафайлы для продукта          
			  console.log(image);
		          item.mediaFiles.push({ url : image.media_key});
		        } catch (mediaError) { // Логируем ошибку загрузки медиафайлов, но продолжаем обработку других продуктов          
		          console.error(`Error fetching media for product_id ${item.productId}: ${mediaError.message}`);
	        	  item.media = [];  // Если ошибка загрузки медиафайлов, оставляем пустой массив
		        }
	        	return item;
		      })	
		    );    


	        } catch (mediaError) { // Логируем ошибку загрузки медиафайлов, но продолжаем обработку других продуктов          
	          console.error(`Error fetching media for product_id ${item.productId}: ${mediaError.message}`);
	          item.media = [];  // Если ошибка загрузки медиафайлов, оставляем пустой массив
	        }
        	return item;
	      })	
	    );    
        sendResponse(res, 200, { status: true, reviews});	
       } catch (error) {
        sendResponse(res, (Number(error) || 500), { code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
    }
};
