const express = require('express');
const router = express.Router();
const common = require("openfsm-common"); // Библиотека с общими параметрами
const { getLike, setLike, getRating, getReviewCount, getReviews } = require('../controllers/RecommendationController');
const authMiddleware = require('openfsm-middlewares-auth-service');

router.get('/v1/like/:productId', authMiddleware.authenticateToken, getLike);  // получить лайки
router.post('/v1/like/:productId', authMiddleware.authenticateToken, setLike);  //  сохранить лайки
router.get('/v1/rating/:productId', authMiddleware.authenticateToken, getRating);  //  сохранить лайки
router.get('/v1/review/:productId', authMiddleware.authenticateToken, getReviews);  //  сохранить лайки
router.get('/v1/review/:productId/counter', authMiddleware.authenticateToken, getReviewCount);  //  сохранить лайки



module.exports = router;
