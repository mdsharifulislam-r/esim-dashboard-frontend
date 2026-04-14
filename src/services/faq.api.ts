import { baseApi } from './api';
import type { ApiResponse, Faq, QueryParams } from '@/types';

export const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaqs: builder.query<ApiResponse<Faq>, QueryParams>({
      query: (params) => ({ url: '/faq', params }),
      providesTags: ['Faq'],
    }),
    createFaq: builder.mutation<{ success: boolean; message: string }, Partial<Faq>>({
      query: (body) => ({ url: '/faq', method: 'POST', body }),
      invalidatesTags: ['Faq'],
    }),
    updateFaq: builder.mutation<{ success: boolean; message: string }, { id: string; data: Partial<Faq> }>({
      query: ({ id, data }) => ({ url: `/faq/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Faq'],
    }),
    deleteFaq: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/faq/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Faq'],
    }),
  }),
});

export const { useGetFaqsQuery, useCreateFaqMutation, useUpdateFaqMutation, useDeleteFaqMutation } = faqApi;
