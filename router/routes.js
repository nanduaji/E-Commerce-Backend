const { addProducts } = require('../controllers/productController');
const { addUser, userLogin, getUsers } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const routes = require('express').Router();
routes.post('/addUser', addUser);
routes.post('/getUsers',authMiddleware, getUsers);
routes.post('/userLogin', userLogin);
routes.post('/addProducts',authMiddleware, addProducts);
module.exports = routes;