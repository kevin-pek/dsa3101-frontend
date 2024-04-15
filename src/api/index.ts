import axios from "axios"

const BASE_URL = "http://localhost:5001"

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export const handleError = (error: unknown) => {
  // propagate error to be handled by swr
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw Error(error.response.data.message)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      throw Error(error.request)
    }
  } else if (error instanceof Error) {
    // Something happened in setting up the request that triggered an Error
    throw Error(error.message)
  }
  throw error
}

export const fetcher = async (url: string) => {
  try {
    const response = await apiClient.get(url)
    return response.data
  } catch (error) {
    handleError(error)
  }
}

export const postRequest = async <T>(url: string, data: T) => {
  try {
    const response = await apiClient.post(url, data)
    return response.data
  } catch (error) {
    handleError(error)
  }
}

export const putRequest = async <T>(url: string, id: number, data: T) => {
  try {
    const response = await apiClient.put(`${url}/${id}`, data)
    return response.data
  } catch (error) {
    handleError(error)
  }
}

export const deleteRequest = async (url: string, id: number) => {
  try {
    const response = await apiClient.delete(`${url}/${id}`)
    return response.data
  } catch (error) {
    handleError(error)
  }
}
