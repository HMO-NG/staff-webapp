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

export async function CreateProviderServiceTariffService(data: any) {
  return ApiService.fetchData<{
      message: string,
      data: any,
  }>({
      url: '/provider/service/tariff/create',
      method: 'post',
      data
  })
}

export async function getProviderServiceTariffByIdfService(id: string) {
  return ApiService.fetchData<{
      message: string,
      data: any,
      count:number
  }>({
      url: `/provider/service/tariff/get/${id}`,
      method: 'get',
  })
}

export async function getAllProviderServiceTariffService() {
  return ApiService.fetchData<{
      message: string,
      data: any,
  }>({
      url: '/provider/service/tariff/getall',
      method: 'get',
  })
}

export async function getSingleProviderServiceTariffByIdService(id: string) {
  return ApiService.fetchData<{
      message: string,
      data: any,
  }>({
      url: `/provider/service/tariff/${id}`,
      method: 'get',
  })
}


export async function CreateProviderDrugTariffService(data: any) {
  return ApiService.fetchData<{
      message: string,
      data: any,
  }>({
      url: '/provider/drug/tariff/create',
      method: 'post',
      data
  })
}

export async function getProviderDrugTariffByIdfService(id: string) {
  return ApiService.fetchData<{
      message: string,
      data: any,
      count:number
  }>({
      url: `/provider/drug/tariff/get/${id}`,
      method: 'get',
  })
}

export async function getAllProviderDrugTariffService() {
  return ApiService.fetchData<{
      message: string,
      data: any,
  }>({
      url: '/provider/drug/tariff/getall',
      method: 'get',
  })
}

export async function getSingleProviderDrugTariffByIdService(id: string) {
  return ApiService.fetchData<{
      message: string,
      data: any,
  }>({
      url: `/provider/drug/tariff/${id}`,
      method: 'get',
  })
}
