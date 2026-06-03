import { baseApi } from './api';
import type { ApiResponse, Banner, QueryParams } from '@/types';

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query<ApiResponse<Banner>, QueryParams>({
      query: (params) => ({ url: '/banner', params }),
      providesTags: ['Banner'],
    }),
    getBanner: builder.query<{ success: boolean; data: Banner }, string>({
      query: (id) => `/banner/${id}`,
      providesTags: ['Banner'],
    }),
    createBanner: builder.mutation<{ success: boolean; message: string }, Partial<Banner>>({
      query: (body) => ({ url: '/banner', method: 'POST', body }),
      invalidatesTags: ['Banner'],
    }),
    updateBanner: builder.mutation<{ success: boolean; message: string }, { id: string; data: Partial<Banner> }>({
      query: ({ id, data }) => ({ url: `/banner/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Banner'],
    }),
    deleteBanner: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/banner/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Banner'],
    }),
    toggleBannerStatus: builder.mutation<{ success: boolean; message: string }, { id: string; status: string }>({
      query: ({ id, status }) => ({ url: `/banner/${id}`, method: 'PATCH', body: { status } }),
      invalidatesTags: ['Banner'],
    }),
  }),
});

export const {
  useGetBannersQuery,
  useGetBannerQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
  useToggleBannerStatusMutation,
} = bannerApi;
