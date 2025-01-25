const amqp = require('amqplib');
const db = require('openfsm-database-connection-producer');
const { v4: uuidv4 } = require('uuid'); // Убедитесь, что установлен uuid версии 8
const authMiddleware = require('openfsm-middlewares-auth-service');

const SQL = require('common-recommendation-service').SQL;
const MESSAGES = require('common-recommendation-service').MESSAGES;
const LANGUAGE = 'RU';
const logger = require('openfsm-logger-handler');


require('dotenv').config();

   /* Сохранить лайк */
   exports.setLike = async (productId, userId, status = false) => {
    const result = await new Promise((resolve, reject) => {
      db.query(SQL.RECOMMENDATION.SET_LIKE, [productId, userId, status], (err, result) => {
        if (err) {
          logger.error(err);
          return reject(err);
        }
        resolve(result); // Предполагается, что поле isConfirmed
      });
     });  
    return (result ? true: false)
  };

  /* найти по productId */
  exports.getProductLikes = async (productId) => {
    const result = await new Promise((resolve, reject) => {
      db.query(SQL.RECOMMENDATION.GET_LIKES, [productId], (err, result) => {
        if (err) {
          logger.error(err);
          return reject(err);
        }
        resolve(result); // Предполагается, что поле isConfirmed
      });
     });  
    return (result?.rows[0].likes || 0)
  };

  /* найти like пользователя по productId */
  exports.getLike = async (userId, productId) => {
    const result = await new Promise((resolve, reject) => {
      db.query(SQL.RECOMMENDATION.GET_LIKE, [userId, productId], (err, result) => {
        if (err) {
          logger.error(err);
          return reject(err);
        }
        resolve(result); // Предполагается, что поле isConfirmed
      });
     });  
    return (result?.rows[0].like || 0)
  };

  /* найти рейтинг продукта по productId */
  exports.getRating = async (productId) => {
    const result = await new Promise((resolve, reject) => {
      db.query(SQL.RECOMMENDATION.GET_RATING, [productId], (err, result) => {
        if (err) {
          logger.error(err);
          return reject(err);
        }
        resolve(result); // Предполагается, что поле isConfirmed
      });
     });  
    return (result?.rows[0].rating || 0)
  };

  exports.setRating = async (productId, rating, userId) => {
    const result = await new Promise((resolve, reject) => {
      db.query(SQL.RECOMMENDATION.SET_RATING,  [productId, rating, userId], (err, result) => {
        if (err) {
          logger.error(err);
          return reject(err);
        }
        resolve(result); // Предполагается, что поле isConfirmed
      });
     });  
    return (result ? true : false)
  };


  /* найти рейтинг продукта по productId */
  exports.getReviewCount = async (productId) => {
    const result = await new Promise((resolve, reject) => {
      db.query(SQL.RECOMMENDATION.GET_REVIEW_COUNT,  [productId], (err, result) => {
        if (err) {
          logger.error(err);
          return reject(err);
        }
        resolve(result); // Предполагается, что поле isConfirmed
      });
     });  
    return (result?.rows ? result?.rows[0].reviewCount : 0)
  };

  exports.getReviews = async (productId) => {
    const result = await new Promise((resolve, reject) => {
      db.query(SQL.RECOMMENDATION.GET_REVIEWS,  [productId], (err, result) => {
        if (err) {
          logger.error(err);
          return reject(err);
        }
        resolve(result); // Предполагается, что поле isConfirmed
      });
     });  
    return (result?.rows ? result?.rows : null)
  };


  exports.getReviewImages = async (reviewId) => {
    const result = await new Promise((resolve, reject) => {
      db.query(SQL.RECOMMENDATION.GET_REVIEW_IMAGES,  [reviewId], (err, result) => {
        if (err) {
          logger.error(err);
          return reject(err);
        }
        resolve(result); // Предполагается, что поле isConfirmed
      });
     });  
    return (result?.rows ? result?.rows : null)
  };
  


  exports.getReview = async  (productId, userId) => {
    const result = await new Promise((resolve, reject) => {
      db.query(SQL.RECOMMENDATION.GET_REVIEW,  [productId, userId], (err, result) => {
        if (err) {
          logger.error(err);
          return reject(err);
        }
        resolve(result); // Предполагается, что поле isConfirmed
      });
     });  
    return (result?.rows ? result?.rows : null)
  };

  exports.setReview = async (productId, userId, message) => {
    const result = await new Promise((resolve, reject) => {
      db.query(SQL.RECOMMENDATION.GET_REVIEW,  [productId, userId, message], (err, result) => {
        if (err) {
          logger.error(err);
          return reject(err);
        }
        resolve(result); // Предполагается, что поле isConfirmed
      });
     });  
    return (result?.rows ? result?.rows[0].id : null)
  };


  exports.setReviewImage = async (reviewId, mediaId, mediaKey, productId, userId, storage, bucket) => {
    const result = await new Promise((resolve, reject) => {
      db.query(SQL.RECOMMENDATION.SET_REVIEW_IMAGE, [reviewId, mediaId, mediaKey, productId, userId, storage, bucket ], (err, result) => {
        if (err) {
          logger.error(err);
          return reject(err);
        }
        resolve(result); // Предполагается, что поле isConfirmed
      });
     });  
    return (result ? true : false)
  };

  exports.deleteReviewImage = async (fileId, userId) => {
    const result = await new Promise((resolve, reject) => {
      db.query(SQL.RECOMMENDATION.DELETE_REVIEW_IMAGE,  [fileId, userId], (err, result) => {
        if (err) {
          logger.error(err);
          return reject(err);
        }
        resolve(result); // Предполагается, что поле isConfirmed
      });
     });  
    return (result ? true : false)
  };


