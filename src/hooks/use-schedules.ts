import { timeStringToString } from "./../utils/time"
import useSWR, { mutate } from "swr"
import { deleteRequest, fetcher, postRequest, putRequest } from "../api"
import { Schedule, ScheduleParameters } from "../types/schedule"
import { create } from "zustand"
import dayjs from "dayjs"
import { stringToTimeString } from "../utils/time"

/**
 * We don't use mutate for schedule requests since these are done in bulk.
 */
export const useDeleteSchedule = () => {
  return async (id: number) => await deleteRequest("/schedule", id)
}

export const useUpdateSchedule = () => {
  return async (data: Schedule) => {
    const sched = { ...data, week: dayjs(data.week).format("YYYY-MM-DD").toString() }
    await putRequest("/schedule", data.id, sched)
  }
}

export const useAddSchedule = () => {
  return async (data: Omit<Schedule, "id">) => {
    await postRequest("/schedule", data)
  }
}

export const useGenerateSchedule = () => {
  return async (params: ScheduleParameters) => {
    await new Promise((resolve) => setTimeout(resolve, 5000))
    await postRequest("/generate_schedule", params)
    mutate("/schedule") // trigger a refetch after schedule is generated
  }
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
  addItem: (item: Schedule) =>
    set((state) => ({ newId: state.newId - 1, items: [...state.items, item] })),
  updateItem: (newItem: Schedule) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === newItem.id ? { ...item, ...newItem } : item)),
    })),
  removeItem: (id: number) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  setItem: (s: Schedule[]) => set((state) => ({ items: s })),
}))
