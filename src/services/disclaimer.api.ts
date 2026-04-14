import { baseApi } from './api';
import type { Disclaimer, Discount } from '@/types';

export const disclaimerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDisclaimer: builder.query<{ success: boolean; data: string }, string>({
      query: (type) => `/disclaimer?type=${type}`,
      providesTags: ['Disclaimer'],
    }),
    updateDisclaimer: builder.mutation<{ success: boolean; message: string }, { type: string; content: string }>({
      query: ({ type, content }) => ({ url: `/disclaimer`, method: 'POST', body: { content, type } }),
      invalidatesTags: ['Disclaimer'],
    }),
  }),
});

export const discountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDiscount: builder.query<{ success: boolean; data: Discount }, void>({
      query: () => '/admin/discount',
      providesTags: ['Discount'],
    }),
    updateDiscount: builder.mutation<{ success: boolean; message: string },any>({
      query: (body) => ({ url: '/admin/discount', method: 'POST', body }),
      invalidatesTags: ['Discount'],
    }),
  }),
});

export const { useGetDisclaimerQuery, useUpdateDisclaimerMutation } = disclaimerApi;
export const { useGetDiscountQuery, useUpdateDiscountMutation } = discountApi;
