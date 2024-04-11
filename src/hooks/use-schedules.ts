import useSWR, { mutate } from "swr"
import { deleteRequest, fetcher, postRequest, putRequest } from "../api"
import { Schedule } from "../types/schedule"
import { create } from "zustand"

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
  return (data: Omit<Schedule, "id">) =>
    mutate("/schedule", async () => await postRequest("/schedule", data), false)
}

interface Store {
  items: Schedule[]
  newId: number // negative ids to assign locally created schedule items
}

interface StoreActions {
  addItem: (s: Schedule) => void
  updateItem: (s: Schedule) => void
  removeItem: (id: number) => void
  setItem: (s: Schedule[]) => void
}

// zustand store for storing local changes to the schedule
export const useLocalSchedule = create<Store & StoreActions>((set) => ({
  items: [],
  newId: -1,
  addItem: (item: Schedule) => set((state) => ({ newId: state.newId - 1, items: [...state.items, item] })),
  updateItem: (newItem: Schedule) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === newItem.id ? { ...item, ...newItem } : item)),
    })),
  removeItem: (id: number) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  setItem: (s: Schedule[]) => set((state) => ({ items: s })),
}))
