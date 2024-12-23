const express = require('express');
const router = express.Router();
const common = require("openfsm-common"); // Библиотека с общими параметрами
const { getLike, setLike } = require('../controllers/RecommendationController');
const authMiddleware = require('openfsm-middlewares-auth-service');

router.get('/v1/like/:productId', authMiddleware.authenticateToken, getLike);  // получить лайки
router.post('/v1/like', authMiddleware.authenticateToken, setLike);  //  сохранить лайки


module.exports = router;
