import express from 'express';
import UserController from './controllers/UserController';
import MovieController from './controllers/MovieController';
import { Authentication } from './middlewares/Authentication';

const routes = express.Router();
const userController = new UserController();
const movieController = new MovieController();

// Rotas para controle de operações de Usuários
routes.post('/users',userController.create);
routes.put('/users',userController.edit);
routes.delete('/users/:idUser',userController.delete);
routes.post('/users/login',userController.login);

// Rotas para controler de operações com filmes
routes.post('/movies',Authentication,movieController.create);
routes.post('/movies/rate',Authentication,movieController.rating);

routes.get('/movies/searchName/:param',movieController.searchByName);
routes.get('/movies/searchDirector/:param',movieController.searchByDirector);
routes.get('/movies/searchGenus/:param',movieController.searchByGenus);
routes.get('/movies/searchStars/:param',movieController.searchByStar);
routes.get('/movies/all',movieController.index);

export default routes;
