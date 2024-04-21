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
  return (data: Employee) => mutate("/employee", async () => await postRequest("/employee", data))
}

export const useUploadEmployee = () => {
  return async (data: File) => {
    // Create a new FileReader instance
    const reader = new FileReader()

    // Define a promise to read the file as text
    const readFileAsText = () => {
      return new Promise<string>((resolve, reject) => {
        reader.onload = (event) => {
          if (event.target) {
            // Resolve with the text content of the file
            resolve(event.target.result as string)
          } else {
            // Reject if reading the file fails
            reject(new Error("Failed to read file"))
          }
        }
        // Start reading the file as text
        reader.readAsText(data[0])
      })
    }

    try {
      // Wait for the file to be read as text
      const fileContent = await readFileAsText()
      // Parse CSV data into array of dictionaries
      const csvData: Record<string, string>[] = []
      // Split file content into rows
      const csvRows = fileContent.split("\n")
      // Extract headers (first row)
      const headers = csvRows[0].split(",").map((header) => header.trim())

      // Parse each row (starting from index 1)
      for (let i = 1; i < csvRows.length; i++) {
        const rowValues = csvRows[i].split(",")
        if (rowValues.length !== headers.length) {
          continue // Skip rows with incorrect number of values
        }
        // Create dictionary object for the row
        const rowObject: Record<string, string> = {}
        headers.forEach((header, index) => {
          rowObject[header] = rowValues[index].trim()
        })
        // Add row object to csvData array
        csvData.push(rowObject)
      }
      // csvData as an array of dictionaries (objects)
      console.log("CSV Data:", csvData)

      await postRequest('/employees', csvData);
      mutate('/employee')
    } catch (error) {
      console.error("Error reading file:", error);
      // Handle error reading file
    }
  }
}
