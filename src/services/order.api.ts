import { baseApi } from './api';
import type { ApiResponse, ApiSingleResponse, Order, OrderDetails, QueryParams } from '@/types';

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<ApiResponse<Order>, QueryParams>({
      query: (params) => ({ url: '/esim/order', params }),
      providesTags: ['Order'],
    }),
    getOrderDetails: builder.query<ApiSingleResponse<OrderDetails>, string>({
      query: (id) => `/esim/order/${id}`,
      providesTags: ['Order'],
    }),
  }),
});

export const { useGetOrdersQuery, useGetOrderDetailsQuery } = orderApi;
