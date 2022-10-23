/**
 * O padrão Repository de acesso ao banco de dados é muito utilizado e possui
 * um grande diferencial, que é a possibilidade de trabalhar com cada fluxo de 
 * forma independenete. Logo fica muito mais rápido, prático e eficiente a 
 * manutenção em trechos do código, e a aplicação de regras de negócios devido
 * o fragmentação de tarefas no projeto.
 */

import database from '../databases/connection';
import { DefaultResponse, ListObjectsResponse } from './../interfaces/ApiResponses';
import { MovieCreation, MovieRate } from './../interfaces/MovieInterfaces';

class MovieRepository {
    async add(data: MovieCreation): Promise<DefaultResponse> {
        var {
            name,
            originalTitle,
            release,
            duration,
            activated,
            description
        } = data;

        var trx = await database.transaction();

        try {
            await trx('movie').insert({
                name,
                originalTitle,
                release,
                duration,
                activated,
                description
            });

            await trx.commit();
            return { success: true, message: "Filme Registrado com Sucesso" };

        } catch (error) {
            // Armazenar o erro em um arquivo.txt de logs
            console.log(error);
            await trx.rollback();
            return { success: false, message: "Falha na Operação de Registro de Filme " + error }
        }
    }

    async rate(data: MovieRate): Promise<DefaultResponse> {
        var { id_user, id_movie, rate } = data;
        var trx = await database.transaction();
        try{
            var creation = new Date();
            await trx('rating').insert({
                id_user,
                id_movie,
                rate,
                creation
            });

            await trx.commit();
            return { success: true, message: "Voto Registrado com Sucesso" };
        } catch (error) {
            // Armazenar o erro em um arquivo.txt de logs
            console.log(error);
            await trx.rollback();
            return { success: false, message: "Falha na Operação de Registro de Voto " + error }
        }
    }

    async getMoviesByName(movieName:string): Promise<ListObjectsResponse> {
        var trx = await database.transaction();
        try {
            var movies = await trx('movie').where('name', 'like', `${movieName}%`).select("*");
            trx.destroy();
            return {success: true, data: movies}
        } catch (error) {
            console.log(error);
            await trx.rollback();
            return {success: false, data:[]}
        }
    }

    async getMoviesByDirector(directorName:string): Promise<ListObjectsResponse>{
        var trx = await database.transaction();
        try {
            var workerType = await trx('worker_type').where('type','like','Diretor').select("*");
            var movies = await trx('worker')
                .join('movie_worker','worker.id','=','movie_worker.id_worker')
                .join('movie','movie_worker.id_movie','=','movie.id')
                .where('movie_worker.id_workerType','=',`${workerType[0].id}`)
                .andWhere('worker.name','like',`${directorName}%`).select("*");
            trx.destroy();
            return {success: true, data: movies}
        } catch (error) {
            console.log(error);
            await trx.rollback();
            return {success: false, data:[]}
        }
    }

    async getMoviesByStars(starName:string): Promise<ListObjectsResponse>{
        var trx = await database.transaction();
        try {
            var workerType = await trx('worker_type').where('type','like','Ator').select("*");
            var movies = await trx('worker')
                .join('movie_worker','worker.id','=','movie_worker.id_worker')
                .join('movie','movie_worker.id_movie','=','movie.id')
                .where('movie_worker.id_workerType','=',`${workerType[0].id}`)
                .andWhere('worker.name','like',`${starName}%`).select("*");
            trx.destroy();
            return {success: true, data: movies}
        } catch (error) {
            console.log(error);
            await trx.rollback();
            return {success: false, data:[]}
        }
    }

    async getMovieByGenus(genusName:string): Promise<ListObjectsResponse>{
        var trx = await database.transaction();
        try {
            var movies = await trx('genus')
                .join('movie_genus','genus.id','=','movie_genus.id_genus')
                .join('movie','movie_genus.id_movie','=','movie.id')
                .where('genus.type','like',`${genusName}%`).select("*");
            trx.destroy();
            return {success: true, data: movies}
        } catch (error) {
            console.log(error);
            await trx.rollback();
            return {success: false, data:[]}
        }
    }

    async getAllMovies(): Promise<ListObjectsResponse>{
        var trx = await database.transaction();
        try {
            var movies = await trx('movie').select("*");
            trx.destroy();
            return {success: true, data: movies}
        } catch (error) {
            console.log(error);
            await trx.rollback();
            return {success: false, data:[]}
        }
    }
}

export { MovieRepository };