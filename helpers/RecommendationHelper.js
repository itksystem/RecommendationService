const amqp = require('amqplib');
const db = require('openfsm-database-connection-producer');
const { v4: uuidv4 } = require('uuid'); // Убедитесь, что установлен uuid версии 8
const authMiddleware = require('openfsm-middlewares-auth-service');
require('dotenv').config();

   /* Сохранить лайк */
   exports.setLike = (productId, userId) => {
    return new Promise((resolve, reject) => {      
      let result = db.query('INSERT INTO likes (product_id, user_id) values (?, ?)', [productId, userId], (err, result) => {
        (err)
        ? reject(err)
        : resolve(true);
      });
    });
  };

  /* найти по productId */
  exports.getProductLikes = (productId) => {
    return new Promise((resolve, reject) => {      
      let result = db.query('SELECT COUNT(product_id) as likes FROM likes WHERE product_id=?', [productId], (err, result) => {
        (err)
        ? reject(err)
        : resolve(result[0] ? result[0].likes : 0)
      });
    });
  };

  /* найти по productId */
  exports.getLike = (userId) => {
    return new Promise((resolve, reject) => {      
      let result = db.query('SELECT COUNT(user_id) as `like` FROM likes WHERE user_id=?', [userId], (err, result) => {
        (err)
        ? reject(err)
        : resolve(result[0] ? Boolean(result[0].like) : false)
      });
    });
  };