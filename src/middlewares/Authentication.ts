import {Request,Response,NextFunction} from 'express';
import {verify} from 'jsonwebtoken';
import {UserDataRequest} from '../interfaces/UserInterfaces';

export function Authentication(
    request: Request,
    response: Response,
    next: NextFunction
) {
    // Pega o token que vem no cabeçalho do request
    var token = request.headers.authorization;

    // Se não houver um token retorna um erro de não autorizado
    if(!token){
        return response.status(401).json({ apiMessage: "Requisição não possui um Token de Acesso" });
    }

    // Verfica se se a chave foi realmente emitida pela Rest Api
    token = token.split(' ')[1]; // Reaproveitar a variável
    try {
        var {email,permissions} = verify(token,"1ea8130d-6f76-45d9-9eaf-8109febda88e") as UserDataRequest;
        
        /**
         * Existe a técnica de modificar a variável Request no Node
         * Então adicionei dois campos na requisição assim que ela chega na Rest Api
         * vinda do front-end, (userEmail) --> que é o email do usuário e
         * (userPermissions) --> que é uma lista com todas as permissões desse usuário
         * Esses dados são colocados no JWT assim assim que o usuário realiza o login, e
         * obtidos novamente na hora que o token é validado. A partir de então, eu consigo
         * obter não só o email do usuário mas como também a lista contendo todas as suas
         * permissões a qualquer momento dentro de um controller. O que facilita na hora
         * de trancar rotas com base em permissões. Lembrando que isso pode ser feito para
         * qualquer dado do usuário além de email e permissões, como Id, cpf ou qualquer
         * outro dado armazenado no banco de dados.
         */
        
        request.userEmail = email;
        request.userPermissions = permissions;
        return next();
    } catch (error) {
        return response.status(401).json({ apiMessage: "Token não Reconhecido pela Aplicação" });
    }
}