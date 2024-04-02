import useSWR from "swr"
import { fetcher } from "../api/swr"
import { useCallback } from 'react';
import { deleteEmployee } from "../api/employee";
import { Employee } from "../api/employee";

export const useEmployees = () => {
  const { data, isLoading } = useSWR<Employee[]>("Employee", fetcher)
  return { employees: data || [], isLoading }
}

export const useDeleteEmployee = () => {
  const { data: employees, mutate } = useSWR('Employee', fetcher);

  const handleDelete = useCallback(async (employeeId) => {
    const updatedEmployees = await deleteEmployee(employeeId, employees);

    mutate(updatedEmployees, false);
  }, [employees, mutate]);

  return handleDelete;
};