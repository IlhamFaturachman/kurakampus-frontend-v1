import { api } from '@/boot/axios'
import type { AxiosResponse } from 'axios'

export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

class ApiService {
  async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response: AxiosResponse<T> = await api.get(url, { params })
    return response.data
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response: AxiosResponse<T> = await api.post(url, data)
    return response.data
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response: AxiosResponse<T> = await api.put(url, data)
    return response.data
  }

  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await api.delete(url)
    return response.data
  }

  async patch<T>(url: string, data?: unknown): Promise<T> {
    const response: AxiosResponse<T> = await api.patch(url, data)
    return response.data
  }
}

export default new ApiService()
