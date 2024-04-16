import useSWR, { mutate } from "swr"
import { deleteRequest, fetcher, postRequest, putRequest } from "../api"
import { Employee } from "../types/employee"

export const useEmployees = () => {
  const { data, isLoading } = useSWR<Employee[]>("/employee", fetcher)
  return { employees: data || [], isLoading }
}

export const useDeleteEmployee = () => {
  return (id: number) =>
    mutate("/employee", async () => await deleteRequest("/employee", id), {
      optimisticData: (prev: Employee[] | undefined) => prev?.filter((b) => b.id !== id) || [],
    })
}

export const useUpdateEmployee = () => {
  return (data: Employee) =>
    mutate("/employee", async () => await putRequest("/employee", data.id, data), {
      optimisticData: (prev: Employee[] | undefined) =>
        prev?.map((b) => (b.id === data.id ? data : b)) || [],
    })
}

export const useAddEmployee = () => {
  return (data: Employee) =>
    mutate("/employee", async () => await postRequest("/employee", data))
}

export const useUploadEmployee = () => {
  return (data: File) =>
    mutate("/employee", async () => await postRequest("/employee", data), false)
}
