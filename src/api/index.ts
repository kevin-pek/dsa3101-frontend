import axios from "axios"
import faker from "faker";
import { ActualDemand, PredictedDemand } from "../types/demand"

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

export function generatePredictedDemand (dateRange: [Date, Date], numRecords: number): PredictedDemand[] {
  const [startDate, endDate] = dateRange;
  const predictedDemand : PredictedDemand[] = [];

  for (let i = 0; i < numRecords; i++) {
    const randomDate = faker.date.between(startDate, endDate).toISOString().slice(0,10);
    const time = faker.time.recent();
    const day = faker.date.day();
    const customers = faker.datatype.number({min: 1, max: 1000});

    predictedDemand.push({date : randomDate, time, day, customers});
  }

  return predictedDemand;
}

export function generateActualDemand (dateRange: [Date, Date], numRecords: number): ActualDemand[] {
  const [startDate, endDate] = dateRange;
  const actualDemand : ActualDemand[] = [];

  for (let i = 0; i < numRecords; i++) {
    const randomDate = faker.date.between(startDate, endDate).toISOString().slice(0,10);
    const time = faker.time.recent();
    const day = faker.date.day();
    const customers = faker.datatype.number({min: 1, max: 1000});

    actualDemand.push({date : randomDate, time, day, customers});
  }

  return actualDemand;
}