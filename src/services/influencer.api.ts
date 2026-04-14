import { baseApi } from './api';
import type { ApiResponse, Influencer, QueryParams } from '@/types';

export const influencerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInfluencers: builder.query<ApiResponse<Influencer>, QueryParams>({
      query: (params) => ({ url: '/admin/influencer', params }),
      providesTags: ['Influencer'],
    }),
    createInfluencer: builder.mutation<{ success: boolean; message: string }, FormData>({
      query: (body) => ({ url: '/admin/influencer', method: 'POST', body }),
      invalidatesTags: ['Influencer'],
    }),
    updateInfluencer: builder.mutation<{ success: boolean; message: string }, { id: string; data: FormData }>({
      query: ({ id, data }) => ({ url: `/admin/influencer/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Influencer'],
    }),
    deleteInfluencer: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/admin/influencer/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Influencer'],
    }),
    toggleInfluencerLock: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/user/lock/${id}`, method: 'PATCH' }),
      invalidatesTags: ['Influencer'],
    }),
  }),
});

export const {
  useGetInfluencersQuery,
  useCreateInfluencerMutation,
  useUpdateInfluencerMutation,
  useDeleteInfluencerMutation,
  useToggleInfluencerLockMutation,
} = influencerApi;
