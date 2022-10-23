/**
 * A ideia principal é padronizar os tipos de dados que serão recebidos pela Rest API
 * vindos do front-end. Todo dado que chegar no formato JSON do front terá sua forma,
 * seus campos e atributos descritos por aqui
 */

// Interface para cadastro de usuários
interface UserCreation {
    name: string,
    email: string,
    password: string,
    biography: Text,
    comments:string,
    id_roles:number
}

// Interface para Edição de dados de Usuário
interface UserEdition {
    idUser: number,
    name: string,
    email: string,
    password: string,
    activated: number,
    biography: Text,
    comments:string
}

// Interface para realização de login
interface AuthLogin {
    email: string,
    password: string
}

// Interface para tipar os dados que vêm dentro do token
// e inserí-los da request
interface UserDataRequest {
    email: string,
    permissions:[]
}

export {UserCreation,UserEdition,AuthLogin,UserDataRequest};
