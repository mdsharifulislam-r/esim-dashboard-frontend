import { baseApi } from './api';
import type { ApiResponse, Admin, QueryParams } from '@/types';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdmins: builder.query<ApiResponse<Admin>, QueryParams>({
      query: (params) => ({ url: '/admin', params }),
      providesTags: ['Admin'],
    }),
    createAdmin: builder.mutation<{ success: boolean; message: string }, FormData>({
      query: (body) => ({ url: '/admin', method: 'POST', body }),
      invalidatesTags: ['Admin'],
    }),
    updateAdmin: builder.mutation<
      { success: boolean; message: string },
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/admin/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Admin'],
    }),
    deleteAdmin: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/admin/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Admin'],
    }),
  }),
});

export const {
  useGetAdminsQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} = adminApi;
