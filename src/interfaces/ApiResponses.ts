/**
 * O intuito desse arquivo é definir as interfaces para os vários tipos
 * de retornos que a REST api deve retornar para o front-end
 */

interface DefaultResponse {
    success: boolean,
    message: string
}

interface ListObjectsResponse {
    success: boolean,
    data:any[]
}

export {DefaultResponse,ListObjectsResponse};