import { baseApi } from './api';
import type { ApiResponse, Review, QueryParams } from '@/types';

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query<ApiResponse<Review>, QueryParams>({
      query: (params) => ({ url: '/review', params }),
      providesTags: ['Review'],
    }),
    updateReviewStatus: builder.mutation<{ success: boolean; message: string }, { id: string; status: string }>({
      query: ({ id, status }) => ({ url: `/review/${id}`, method: 'PATCH', body: { status } }),
      invalidatesTags: ['Review'],
    }),
    deleteReview: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/review/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Review'],
    }),
  }),
});

export const { useGetReviewsQuery, useUpdateReviewStatusMutation, useDeleteReviewMutation } = reviewApi;
