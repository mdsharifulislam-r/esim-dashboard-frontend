import { baseApi } from './api';
import type { ImageBanner } from '@/types';

type ImageBannerListResponse = {
  success: boolean;
  message: string;
  data: ImageBanner[] | ImageBanner;
};

const normalizeImageBanners = (response: ImageBannerListResponse) => ({
  ...response,
  data: Array.isArray(response.data) ? response.data : response.data ? [response.data] : [],
});

export const imageBannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getImageBanners: builder.query<{ success: boolean; message: string; data: ImageBanner[] }, void>({
      query: () => '/imagebanner',
      transformResponse: normalizeImageBanners,
      providesTags: ['ImageBanner'],
    }),
    createImageBanner: builder.mutation<{ success: boolean; message: string }, FormData>({
      query: (body) => ({ url: '/imagebanner', method: 'POST', body }),
      invalidatesTags: ['ImageBanner'],
    }),
    updateImageBanner: builder.mutation<
      { success: boolean; message: string },
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({ url: `/imagebanner/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['ImageBanner'],
    }),
    deleteImageBanner: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/imagebanner/${id}`, method: 'DELETE' }),
      invalidatesTags: ['ImageBanner'],
    }),
  }),
});

export const {
  useGetImageBannersQuery,
  useCreateImageBannerMutation,
  useUpdateImageBannerMutation,
  useDeleteImageBannerMutation,
} = imageBannerApi;
