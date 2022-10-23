import { Request, Response } from 'express';
import { MovieCreation, MovieRate } from './../interfaces/MovieInterfaces';
import { MovieRepository } from './../repositories/MovieRepository';

const movieRepository = new MovieRepository();

class MovieController {

    async create(request: Request, response: Response) {
        // Verifica se o usuário é um administrador antes de prosseguir
        var {userEmail,userPermissions} = request;
        var isAdmin = false;
        for(var i=0; i<userPermissions.length; i++){
            if(userPermissions[i] === 'ADMIN'){isAdmin = true;}
        }
        if(!isAdmin) {return response.status(401).json({ apiMessage: "Permissão Negada"});}

        // chamar repositório para inserir
        var movieData:MovieCreation = request.body;
        var responseOperation = await movieRepository.add(movieData);

        if (responseOperation.success) {
            return response.status(201).json({ apiMessage: responseOperation.message, movie: movieData });
        } else {
            return response.status(400).json({ apiMessage: responseOperation.message });
        }
    }

    async rating(request: Request, response: Response){
        // Verificar se o usuário possui permissão para votar (se ele é um usuário comun)
        var {userEmail,userPermissions} = request;
        var isDefault = false;
        for(var i=0; i<userPermissions.length; i++){
            if(userPermissions[i] === 'DEFAULT'){isDefault = true;}
        }
        if(!isDefault) {return response.status(401).json({ apiMessage: "Permissão Negada"});}

        // Chamar repositório para inserir o voto na base de dados
        var rateData:MovieRate = request.body;
        var responseOperation = await movieRepository.rate(rateData);

        if (responseOperation.success) {
            return response.status(201).json({ apiMessage: responseOperation.message });
        } else {
            return response.status(400).json({ apiMessage: responseOperation.message });
        }
    }

    async searchByName(request: Request, response: Response){
        // Chamar repositório para obter filme por nome
        var { param } = request.params;
        var responseOperation = await movieRepository.getMoviesByName(param);

        if (responseOperation.success) {
            return response.status(200).json(responseOperation.data);
        } else {
            return response.status(400).json({apiMessage: "Falha ao realizar a busca"});
        }
    }

    async searchByDirector(request: Request, response: Response){
        // Chamar repositório para obter filme por diretor
        var { param } = request.params;
        var responseOperation = await movieRepository.getMoviesByDirector(param);

        if (responseOperation.success) {
            return response.status(200).json(responseOperation.data);
        } else {
            return response.status(400).json({apiMessage: "Falha ao realizar a busca"});
        }
    }

    async searchByStar(request: Request, response: Response){
        // Chamar repositório para obter filme por Ator
        var { param } = request.params;
        var responseOperation = await movieRepository.getMoviesByStars(param);

        if (responseOperation.success) {
            return response.status(200).json(responseOperation.data);
        } else {
            return response.status(400).json({apiMessage: "Falha ao realizar a busca"});
        }
    }

    async searchByGenus(request: Request, response: Response){
        // Chamar repositório para obter filme por Genero
        var { param } = request.params;
        var responseOperation = await movieRepository.getMovieByGenus(param);

        if (responseOperation.success) {
            return response.status(200).json(responseOperation.data);
        } else {
            return response.status(400).json({apiMessage: "Falha ao realizar a busca"});
        }
    }

    async index(request: Request, response: Response){
        // Chamar repositório para obter todos os filmes
        var { param } = request.params;
        var responseOperation = await movieRepository.getAllMovies();

        if (responseOperation.success) {
            return response.status(200).json(responseOperation.data);
        } else {
            return response.status(400).json({apiMessage: "Falha ao realizar a busca"});
        }
    }
}

export default MovieController;