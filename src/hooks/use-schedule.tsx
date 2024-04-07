import useSWR, { mutate } from "swr"
import { deleteRequest, fetcher, postRequest, putRequest } from "../api"
import { Schedule } from "../types/schedule"

export const useSchedules = () => {
  const { data, isLoading } = useSWR<Schedule[]>("/schedule", fetcher)
  return { schedules: data || [], isLoading }
}

export const useDeleteSchedule = () => {
  return (id: number) =>
    mutate("/schedule", async () => await deleteRequest("/schedule", id), {
      optimisticData: (prev: Schedule[] | undefined) => prev?.filter((b) => b.id !== id) || [],
    })
}

export const useUpdateSchedule = () => {
  return (data: Schedule) =>
    mutate("/schedule", async () => await putRequest("/schedule", data.id, data), {
      optimisticData: (prev: Schedule[] | undefined) =>
        prev?.map((b) => (b.id === data.id ? data : b)) || [],
    })
}

export const useAddSchedule = () => {
  return (data: Schedule) =>
    mutate("/schedule", async () => await postRequest("/schedule", data), false)
}
