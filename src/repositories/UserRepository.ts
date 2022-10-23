/**
 * O padrão Repository de acesso ao banco de dados é muito utilizado e possui
 * um grande diferencial, que é a possibilidade de trabalhar com cada fluxo de 
 * forma independenete. Logo fica muito mais rápido, prático e eficiente a 
 * manutenção em trechos do código, e a aplicação de regras de negócios devido
 * o fragmentação de tarefas no projeto.
 */

import database from '../databases/connection';
import {UserCreation,UserEdition,AuthLogin} from './../interfaces/UserInterfaces';
import {DefaultResponse} from './../interfaces/ApiResponses';
import {hash,compare} from 'bcryptjs';
import {sign} from 'jsonwebtoken';


class UserRepository {

    // Função de inserir os dados de um usuário na base de dados da aplicação
    async add(data:UserCreation):Promise<DefaultResponse>{
        var {
            name,
            email,
            password,
            biography,
            comments,
            id_roles
        } = data;
        /** Isso feito em cima se chama desestruturação
         * Os campos que estão dentro do objeto são separados em variáveis
         * independentes, o que pode ser útil em alguns casos
        */
       
        /**
         * Inicia a transação, se houver algum erro na operação com o 
         * SGBD (Sistema de Gerenciamento do Banco de Dados), executa um rollback.
         */
        var trx = await database.transaction();
    
        try {
            // Criptografando a senha antes de armazená-la no banco de dados
            password = await hash(password,8);
            // Inserindo o usuário na tabela "user"
            var idInsert = await trx('user').insert({
                name,
                email,
                password,
                biography,
                comments
            });
            /** O nome do campo é o mesmo nome da variável do objeto desestruturado,
              * logo ao colocar la dentro o knex já insere os dados na tabela automatico
              * Todo insert no knex retorna um lista com o Id de cada registro inserido
            */
    
            // Inserindo a permissão do usuário registrado
            var id_user = idInsert[0];
            await trx('user_roles').insert({
                id_roles,
                id_user
            });
    
            await trx.commit();
            return {success:true,message:"Usuário Registrado com Sucesso"};
        }
        catch (error) {
            // Armazenar o erro em um arquivo.txt de logs
            console.log(error);
            await trx.rollback();
            return {success:false,message:"Falha na Operação de Registro de Usuário"+error}
        }
    }

    // Função para Editar os dados de um Usuário
    async edition(data:UserEdition):Promise<DefaultResponse>{
        var {
            idUser,
            name,
            email,
            password,
            activated,
            biography,
            comments
        } = data;

        var trx = await database.transaction();

        try {

            // Verifica se o usuário existe antes de alterá-lo
            var usuario = await trx('user').select('*').where('id',idUser);
            if(usuario.length == 0) {return {success:false,message:"Usuário Inexistente!"};}

            await trx('user').update({
                name,
                email,
                password,
                activated,
                biography,
                comments
            }).where('id', idUser);

            await trx.commit();
            return {success:true,message:"Dados Alterados com sucesso!"};
        }
        catch (error) {
            console.log(error);
            await trx.rollback();
            return {success:false,message:"Falha na Operação de Edição de Dados do Usuário"+error};
        }
    }

    // Função para Desativar um usuário
    async remove(data:number):Promise<DefaultResponse> {
        var activated = 0;
        var trx = await database.transaction();
        try {
            // Verifica se o usuário existe antes de desativá-lo
            var usuario = await trx('user').select('*').where('id',data);
            if(usuario.length == 0) {return {success:false,message:"Usuário Inexistente!"};}

            await trx('user').update({ activated }).where('id', data);
            await trx.commit();
            return {success:true,message:"Usuário Desativado com Sucesso!"};
        }
        catch (error) {
            console.log(error);
            await trx.rollback();
            return {success:false,message:"Falha na Operação de Desativação de Usuário"+error};
        }
    }

    // Função para autenticação de usuário e emissão do JSON Web Token
    async login(data:AuthLogin):Promise<DefaultResponse>{
        var {email,password} = data;
        
        var trx = await database.transaction();

        try {
            // Verifica se o email existe
            var usuario = await trx('user').select('*').where('email',email);
            if(usuario.length == 0) {return {success:false,message:"Usuário ou Senha Incorretos"};}

            // Verfica se a senha está correta
            var passMatch = await compare(password,usuario[0].password);
            if(!passMatch) {return {success:false,message:"Usuário ou Senha Incorretos"};}

            //Gerar o Token
            //Primeiro, pegar todas as permissões do usuário
            var result = await trx('user_roles')
                .join('roles','user_roles.id_roles','=','roles.id')
                .where('id_user',usuario[0].id)
                .select('*');
            
            //Colocar todas as permissões do usuário em uma lista de strings
            var userPermissions = [];

            for(var i=0;i<result.length;i++) {
                userPermissions.push(result[i].permission);
            }

            // Cria o Token com todas as permissões do usuário e seu email
            // visto que o email é um campo único no banco de dados, ele pode ser
            // utilizado como forma de identificar um usuário logado. 
            /**
             * Estou utilizando um guid como secret do token.
             * O ideal seria colocar esse guid em uma variável de ambiente
             * assim como as informações de conexão com o banco de dados.
             * Não é uma boa prática subir esse tipo de dados (secret do token,
             * dados de conexão com banco etc) para um repositório de códigos
             * como GitHub ou BitBucker, estou fazendo isso porque é um test, mas
             * profissionalmente deve-se utilizar variáveis de ambiente para esse
             * tipo de configuração e adaptá-la de acordo com as necessidades.
             */
            var token = sign({
                email: usuario[0].email,
                permissions: userPermissions
            },"1ea8130d-6f76-45d9-9eaf-8109febda88e",{
                expiresIn:"2h"
            });

            await trx.commit();
            return {success:true,message:token};
        }
        catch(error) {
            console.log(error);
            await trx.rollback();
            return {success:false,message:"Falha na Operação de Login"+error};
        }

    }
}

export {UserRepository};