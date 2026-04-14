import { baseApi } from './api';
import type { ApiResponse, Coupon, QueryParams } from '@/types';

export const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoupons: builder.query<ApiResponse<Coupon>, QueryParams>({
      query: (params) => ({ url: '/coupon', params }),
      providesTags: ['Coupon'],
    }),
    createCoupon: builder.mutation<{ success: boolean; message: string }, Partial<Coupon>>({
      query: (body) => ({ url: '/coupon', method: 'POST', body }),
      invalidatesTags: ['Coupon'],
    }),
    updateCoupon: builder.mutation<{ success: boolean; message: string }, { id: string; data: Partial<Coupon> }>({
      query: ({ id, data }) => ({ url: `/coupon/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Coupon'],
    }),
    deleteCoupon: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/coupon/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Coupon'],
    }),
    toggleCouponStatus: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/coupon/${id}/toggle-status`, method: 'PATCH' }),
      invalidatesTags: ['Coupon'],
    }),
  }),
});

export const {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useToggleCouponStatusMutation,
} = couponApi;
