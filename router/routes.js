const { addUser, userLogin } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const routes = require('express').Router();
routes.post('/addUser', addUser);
routes.post('/userLogin', userLogin);
module.exports = routes;