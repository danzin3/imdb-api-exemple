import { Request, Response } from 'express';
import {UserRepository} from '../repositories/UserRepository';
import { UserCreation, UserEdition, AuthLogin } from './../interfaces/UserInterfaces';

const userRepository = new UserRepository();

class UserController {

    async create(request: Request, response: Response) {
        /**
         * Recebe os dados do corpo da requisição do front end,
         * Logo em seguida realiza o bind com o tipo predefinido
         * no arquivo UserInterfaces para o cadastro de um usuário.
         */
        var userData: UserCreation = request.body;

        /**
         * Chamar a função de inserir os dados no banco, tarefa essa atribuída
         * ào arquivo UserRepository.
         */
        var responseOperation = await userRepository.add(userData);

        /**
         * Se a operação foi concluída com êxito retornar mensagem de sucesso e
         * os dados do usuário que acabou de ser inserido caso o front end precise.
         * Se não enviar mensagem de falha na operaçãoe a mensagem de erro
         */
        if (responseOperation.success) {
            return response.status(201).json({ apiMessage: responseOperation.message, user: userData });
        } else {
            return response.status(400).json({ apiMessage: responseOperation.message });
        }
    }

    async edit(request: Request, response: Response) {
        var userData: UserEdition = request.body;
        var responseOperation = await userRepository.edition(userData);
        if (responseOperation.success) {
            return response.status(201).json({ apiMessage: responseOperation.message, user: userData });
        } else {
            return response.status(400).json({ apiMessage: responseOperation.message });
        }
    }

    async delete(request: Request, response: Response) {
        var { idUser } = request.params;

        var responseOperation = await userRepository.remove(parseInt(idUser));

        if (responseOperation.success) {
            return response.status(201).json({ apiMessage: responseOperation.message });
        } else {
            return response.status(400).json({ apiMessage: responseOperation.message });
        }
    }

    async login(request: Request, response: Response){
        var userData: AuthLogin = request.body;
        var responseOperation = await userRepository.login(userData);
        if (responseOperation.success) {
            return response.status(201).json({ apiMessage: responseOperation.message});
        } else {
            return response.status(400).json({ apiMessage: responseOperation.message });
        }
    }
};

export default UserController;