const common       = require('openfsm-common');  /* Библиотека с общими параметрами */
const CommonFunctionHelper = require("openfsm-common-functions")
const commonFunction= new CommonFunctionHelper();
const RecoHelper = require('../helpers/RecommendationHelper');  /* Библиотека с общими параметрами */
const authMiddleware = require('openfsm-middlewares-auth-service');
const logger = require('openfsm-logger-handler');
const { v4: uuidv4 } = require('uuid'); 
const AuthServiceClientHandler = require("openfsm-auth-service-client-handler");
const authClient = new AuthServiceClientHandler();              // интерфейс для  связи с MC AuthService

require('dotenv').config({ path: '.env-recommendation-service' });


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
        let userId = await authClient.getUserId(req, res);
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
        let userId = await authClient.getUserId(req, res);
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
        let userId = await authClient.getUserId(req, res);
        let productId = req.params.productId;
        if(!userId || !productId) throw(422);               
        let rating = await RecoHelper.getRating(productId);
        console.log(productId,rating);
        sendResponse(res, 200, { status: true, rating : Number(rating).toFixed(1)});	
       } catch (error) {
        sendResponse(res, (Number(error) || 500), { code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
    }
};


exports.setRating = async (req, res) => {          
    try {
        let userId = await authClient.getUserId(req, res);
        let productId = req.params?.productId;
        let _rating = req.body?.rating;
        if(!userId || !productId || !_rating) throw(422);               
        let rating = await RecoHelper.setRating(productId, _rating, userId);
        console.log(productId, rating, userId);
        sendResponse(res, 200, { status: true, productId, rating : Number(_rating).toFixed(1)});	
       } catch (error) {
        sendResponse(res, (Number(error) || 500), { code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
    }
};


exports.getReviewCount = async (req, res) => {          
    try {
        let userId = await authClient.getUserId(req, res);
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
        let userId = await authClient.getUserId(req, res);
        let productId = req.params.productId;
        if(!userId || !productId) throw(422);               
	console.log(productId, userId); 
        let reviews = await RecoHelper.getReviews(productId);
	 const itemsWithMedia = await Promise.all( // Асинхронно загружаем медиафайлы для каждого продукта
	    reviews.map(async (item) => {
	        try { // Загружаем медиафайлы для продукта          
		  console.log(item);
//	          let mediaTtems = await RecoHelper.getReviewImages(item.product_id, item.user_id ); 
	          let mediaTtems = await RecoHelper.getReviewImages(item.id); 
	          item.mediaFiles=[];
	  	  await Promise.all( // Асинхронно загружаем медиафайлы для каждого продукта
		    mediaTtems.map(async (image) => {
		        try { // Загружаем медиафайлы для продукта          
			  console.log(image);
		          item.mediaFiles.push({ url : image.media_key, file_id: image.media_id});
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


exports.getReview = async (req, res) => {          
    try {
        let userId = await authClient.getUserId(req, res);
        let productId = req.params.productId;
        if(!userId || !productId) throw(422);               
	console.log(productId, userId); 
        let reviews = await RecoHelper.getReview(productId, userId);
         console.log(reviews);
         if(reviews?.length > 0) {
	 const itemsWithMedia = await Promise.all( // Асинхронно загружаем медиафайлы для каждого продукта
	    reviews.map(async (item) => {
	        try { // Загружаем медиафайлы для продукта          
		      console.log(item);
	          let mediaTtems = await RecoHelper.getReviewImages(item.id); 
	          item.mediaFiles=[];
 	 	  if(mediaTtems?.length > 0 )  	         
 	           await Promise.all( // Асинхронно загружаем медиафайлы для каждого продукта
		     mediaTtems?.map(async (image) => {
		        try { // Загружаем медиафайлы для продукта          
			  console.log(image);
		          item.mediaFiles.push({ url : image.media_key, file_id: image.media_id});
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
	 }
        sendResponse(res, 200, { status: true, reviews : reviews || []});	
       } catch (error) {
	logger.error(error);
        sendResponse(res, (Number(error) || 500), { code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
    }
};

exports.setReview = async (req, res) => {          
    try {
        let userId = await authClient.getUserId(req, res);
        let productId = req.params.productId;
        let {review} = req.body;
        if(!userId || !productId || !review ) {
	  console.error(productId, userId, review); 
          logger.error(productId, userId, review);
 	  throw(422);               
	}
        let {files} = req.body;
        let reviewId = await RecoHelper.setReview(productId, userId, review);
        // сохраняем изображения
        console.log(files);
	if(files?.length > 0) 
  	  await Promise.all( // Асинхронно загружаем медиафайлы для каждого продукта
	    files.map(async(file) => {
	        try { 
		  console.log(file);
		  let storage  = 'pickmax.products';
		  let bucket   = 'local';  
	          let result = await RecoHelper.setReviewImage(reviewId, file.fileId, file.url, productId, userId, storage, bucket)
	        } catch (mediaError) { // Логируем ошибку загрузки медиафайлов, но продолжаем обработку других продуктов          
	          console.error(`Error fetching media for product_id ${productId}: ${mediaError.message}`);
	        }
	      })	
  	   );
        sendResponse(res, 200, { status: true });	
       } catch (error) {
        console.log(error);
        sendResponse(res, (Number(error) || 500), { code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
    }
};

exports.deleteReviewImage = async (req, res) => {          
    try {
        let userId = await authClient.getUserId(req, res);
        let fileId = req.params.fileId;
        if(!userId || !fileId ) {
	  console.error(fileId, userId); 
          logger.error(fileId, userId); 
 	  throw(422);               
	}
        let result = await RecoHelper.deleteReviewImage(fileId, userId);
        if(!result) throw(403)
        // сохраняем изображения
        sendResponse(res, 200, { status: true });	
       } catch (error) {
        console.log(error);
        sendResponse(res, (Number(error) || 500), { code: (Number(error) || 500), message:  new CommonFunctionHelper().getDescriptionByCode((Number(error) || 500)) });
    }
};
