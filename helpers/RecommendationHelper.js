const amqp = require('amqplib');
const db = require('openfsm-database-connection-producer');
const { v4: uuidv4 } = require('uuid'); // Убедитесь, что установлен uuid версии 8
const authMiddleware = require('openfsm-middlewares-auth-service');
require('dotenv').config();

   /* Сохранить лайк */
   exports.setLike = (productId, userId, status = false) => {
    return new Promise((resolve, reject) => {      
      let result = db.query('INSERT INTO product_likes (product_id, user_id, status) values (?, ?, ?) ON DUPLICATE KEY UPDATE status=?', [productId, userId, status, status], (err, result) => {
      console.log(result);
      console.log(err);
        (err)
        ? reject(err)
        : resolve(true);
      });
    });
  };

  /* найти по productId */
  exports.getProductLikes = (productId) => {
    return new Promise((resolve, reject) => {      
      let result = db.query('SELECT COUNT(product_id) as likes FROM product_likes WHERE product_id=?', [productId], (err, result) => {
      console.log(result);
      console.log(err);
        (err)
        ? reject(err)
        : resolve(result[0] ? result[0].likes : 0)
      });
    });
  };

  /* найти like пользователя по productId */
  exports.getLike = (userId, productId) => {
    return new Promise((resolve, reject) => {      
      let result = db.query('SELECT COUNT(user_id) as `like` FROM product_likes WHERE user_id=? and product_id=? and status=1', [userId, productId], (err, result) => {
      console.log(userId, productId);
      console.log(result);
      console.log(err);
        (err)
        ? reject(err)
        : resolve(result[0] ? result[0].like : 0)
      });
    });
  };

  /* найти рейтинг продукта по productId */
  exports.getRating = (productId) => {
    return new Promise((resolve, reject) => {      
      let result = db.query('SELECT AVG(rating) as `rating` FROM product_ratings WHERE product_id=?', [productId], (err, result) => {
      console.log(productId );
      console.log(result);
      console.log(err);
        (err)
        ? reject(err)
        : resolve(result[0] ? result[0].rating : 0)
      });
    });
  };

  exports.setRating = (productId, rating, userId) => {
    return new Promise((resolve, reject) => {      
      let result = db.query('INSERT INTO product_ratings (product_id, rating, user_id) values (?,?,?) ON DUPLICATE KEY UPDATE rating=?', [productId, rating, userId, rating], (err, result) => {
      console.log(productId );
      console.log(result);
      console.log(err);
        (err)
        ? reject(false)
        : resolve(true)
      });
    });
  };


  /* найти рейтинг продукта по productId */
  exports.getReviewCount = (productId) => {
    return new Promise((resolve, reject) => {      
      let result = db.query('SELECT count(id) as `reviewCount` FROM product_reviews WHERE product_id=?', [productId], (err, result) => {
      console.log(productId );
      console.log(result);
      console.log(err);
        (err)
        ? reject(err)
        : resolve(result[0] ? result[0].reviewCount : 0)
      });
    });
  };

  exports.getReviews = (productId) => {
    return new Promise((resolve, reject) => {      
      let result = db.query('SELECT * FROM product_reviews WHERE product_id=?', [productId], (err, result) => {
      console.log(err);
        (err)
        ? reject(err)
        : resolve(result ? result : null)
      });
    });
  };


  exports.getReviewImages = (productId, userId) => {
    return new Promise((resolve, reject) => {      
      let result = db.query('SELECT * FROM product_reviews_media_storage WHERE product_id=? and user_id=?', [productId, userId], (err, result) => {
      console.log(productId, userId);
      console.log(result);
        (err)
        ? reject(err)
        : resolve(result ? result : null)
      });
    });
  };


  exports.getReviewUser = (productId, userId) => {
    return new Promise((resolve, reject) => {      
      let result = db.query('SELECT * FROM product_reviews WHERE product_id=? and user_id=?', [productId, userId], (err, result) => {
      console.log(err);
        (err)
        ? reject(err)
        : resolve(result ? result : null)
      });
    });
  };
