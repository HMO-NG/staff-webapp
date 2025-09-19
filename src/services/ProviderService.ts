import ApiService from "./ApiService"

type CreateProviderResponse = {
    message: string,
    data: string
}

type GenericProviderResponse = {
    message: string,
    data: any,
}

type ProviderResponse = {
    message: string,
    data: [],
    total: any
}

type MessageResponse = {
    message: string
}

/*
Returns the provider id, name, state, code, and user id, first name and last name as full name */
export async function getAllProvider(data: any) {

    return ApiService.fetchData<ProviderResponse>({
        url: '/provider/get',
        method: 'post',
        data
    })
}

export async function createProvider(data: any) {
    return ApiService.fetchData<CreateProviderResponse>({
        url: '/provider/create',
        method: 'post',
        data
    })
}

// returns a single provider by id
export async function getProviderByID(data: any) {
    return ApiService.fetchData<GenericProviderResponse>({
        url: '/provider/get/id',
        method: 'post',
        data
    })
}

// update the entire record on db as specified by the data object
export async function editProviderByID(data: any) {
    return ApiService.fetchData<MessageResponse>({
        url: '/provider/edit',
        method: 'put',
        data
    })
}

//  update the activation status column in the db
export async function updateProviderActivationStatus(id: string, data: any) {
    return ApiService.fetchData<MessageResponse>({
        url: '/provider/status/edit',
        method: 'patch',
        data
    })
}
// ---NHIA PROVIDERS ---

//  create NHIA provider
export async function createNHIAProviderService(data: any) {
    return ApiService.fetchData<{
        message: string,
        data: any,
    }>({
        url: '/provider/nhia/create',
        method: 'post',
        data
    })
}

// search NHIA providers by HCP ID
export async function searchNHIAProviderByHCPIDService(data: any) {
    return ApiService.fetchData<{
        message: string,
        data: any,
    }>({
        url: '/provider/get',
        method: 'post',
        data
    })
}

export async function CreateProviderTariffService(data: any) {
  return ApiService.fetchData<{
      message: string,
      data: any,
  }>({
      url: '/provider/tariff/create',
      method: 'post',
      data
  })
}

export async function getProviderTariffByIdfService(id: string) {
  return ApiService.fetchData<{
      message: string,
      data: any,
      count:number
  }>({
      url: `/provider/tariff/get/${id}`,
      method: 'get',
  })
}

export async function getAllProviderTariffService() {
  return ApiService.fetchData<{
      message: string,
      data: any,
  }>({
      url: '/provider/tariff/getall',
      method: 'get',
  })
}

export async function getSingleProviderTariffByIdService(id: string) {
  return ApiService.fetchData<{
      message: string,
      data: any,
  }>({
      url: `/provider/tariff/${id}`,
      method: 'get',
  })
}

export async function CreatePreAuthorization(data: any) {
  return ApiService.fetchData<{
      message: string,
      data: any,
  }>({
      url: '/preauthorization/create',
      method: 'post',
      data
  })
}

export async function getAllpreauthorizationRequestService() {
  return ApiService.fetchData<{
      message: string,
      data: any,
  }>({
      url: '/preauthorization/getall',
      method: 'get',
  })
}

export async function getSinglePreAuthorizationByIdService(id: string) {
  return ApiService.fetchData<{
      message: string,
      data: any,
  }>({
      url: `/preauthorization/${id}`,
      method: 'get',
  })
}
export async function UpdatePreAuthorizationService(id:string,data: any) {
  return ApiService.fetchData<{
      message: string,
      data: any,
  }>({
      url: `/preauthorization/update/${id}`,
      method: 'put',
      data
  })
}

export async function getPreAuthorizationByPACodeService(PA_code:string) {
  return ApiService.fetchData<{
      message: string,
      data: any,
  }>({
      url: `/preauthorization/get/pa/code/${PA_code}`,
      method: 'get',
  })
}

export async function updatePreAuthorizationByPACodeService(PA_code:string,data: any) {
  return ApiService.fetchData<{
      message: string,
      data: any,
  }>({
      url: `/preauthorization/update/code/${PA_code}`,
      method: 'put',
      data
  })
}


export async function ProviderTariffBulkUpload(provider_id:string,data: any) {
  return ApiService.fetchData<{
      message: string,
      data: any,
  }>({
      url: `/provider/tarriff/bulk/upload/${provider_id}`,
      method: 'post',
      data
  })
}
