import { baseApi } from './api';
import type { ApiResponse, Newsletter, QueryParams } from '@/types';

export const newsletterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNewsletters: builder.query<ApiResponse<Newsletter>, QueryParams>({
      query: (params) => ({ url: '/newsletter', params }),
      providesTags: ['Newsletter'],
    }),
    deleteNewsletter: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/newsletter/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Newsletter'],
    }),
  }),
});

export const { useGetNewslettersQuery, useDeleteNewsletterMutation } = newsletterApi;
