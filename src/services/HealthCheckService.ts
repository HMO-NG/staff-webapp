import ApiService from "./ApiService"

type Response = {
    message: string,
    data: any
}

export async function sessionChecker() {
    return ApiService.fetchData<Response>({
        url: '/session/checker',
        method: 'get',

    })
}