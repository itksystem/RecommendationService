const express = require('express');
const router = express.Router();
const common = require("openfsm-common"); // Библиотека с общими параметрами
const { getLike, setLike, getRating, setRating, getReviewCount, getReviews, getReviewUser } = require('../controllers/RecommendationController');
const authMiddleware = require('openfsm-middlewares-auth-service');

router.get('/v1/like/:productId', authMiddleware.authenticateToken, getLike);  // получить лайки
router.post('/v1/like/:productId', authMiddleware.authenticateToken, setLike);  //  сохранить лайки
router.get('/v1/rating/:productId', authMiddleware.authenticateToken, getRating);  //  Получить рейтинг
router.post('/v1/rating/:productId', authMiddleware.authenticateToken, setRating);  //  Установить рейтинг
router.get('/v1/review/:productId', authMiddleware.authenticateToken, getReviews);  // Получить отзывы  
router.get('/v1/review/:productId/my/review', authMiddleware.authenticateToken, getReviewUser);  //   получить отзыв пользователя
router.get('/v1/review/:productId/counter', authMiddleware.authenticateToken, getReviewCount);  //  получить количество отзывов



module.exports = router;
