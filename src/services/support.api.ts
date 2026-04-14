import { baseApi } from './api';
import type { ApiResponse, SupportMessage, QueryParams } from '@/types';

export const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSupportMessages: builder.query<ApiResponse<SupportMessage>, QueryParams>({
      query: (params) => ({ url: '/support', params }),
      providesTags: ['Support'],
    }),
    replyToSupport: builder.mutation<{ success: boolean; message: string }, { id: string; reply: string }>({
      query: ({ id, reply }) => ({ url: `/support/${id}`, method: 'PATCH', body: { message: reply } }),
      invalidatesTags: ['Support'],
    }),
    updateSupportStatus: builder.mutation<{ success: boolean; message: string }, { id: string; status: string }>({
      query: ({ id, status }) => ({ url: `/support/${id}/status`, method: 'PATCH', body: { status } }),
      invalidatesTags: ['Support'],
    }),
  }),
});

export const { useGetSupportMessagesQuery, useReplyToSupportMutation, useUpdateSupportStatusMutation } = supportApi;
