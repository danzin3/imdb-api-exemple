/**
 * A ideia principal é padronizar os tipos de dados que serão recebidos pela Rest API
 * vindos do front-end. Todo dado que chegar no formato JSON do front terá sua forma,
 * seus campos e atributos descritos por aqui
 */

// Interface para cadastro de filmes
interface MovieCreation {
    name: string,
    originalTitle: string,
    release: Date,
    duration: string,
    activated: number,
    description: string
}

// Interface para registro de voto
interface MovieRate {
    id_user: number,
    id_movie: number,
    rate: number
}

export {MovieCreation,MovieRate};