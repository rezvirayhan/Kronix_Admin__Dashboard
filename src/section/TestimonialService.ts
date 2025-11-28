/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = "http://localhost:5000/api/testimonials";

export const TestimonialService = {
  getAll: (params?: any) => axios.get(API_URL, { params }),
  getSingle: (id: string) => axios.get(`${API_URL}/${id}`),
  create: (data: any) => axios.post(API_URL, data),
  update: (id: string, data: any) => axios.put(`${API_URL}/${id}`, data),
  delete: (id: string) => axios.delete(`${API_URL}/${id}`),
};
