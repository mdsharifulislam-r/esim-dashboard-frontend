import { baseApi } from './api';
import type { PricingRules } from '@/types';

export const pricingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPricingRules: builder.query<{ success: boolean; data: PricingRules }, void>({
      query: () => '/pricingrules',
      providesTags: ['PricingRules'],
    }),
    updatePricingRules: builder.mutation<
      { success: boolean; message: string },
      { margin_price: number; tax_percent: number }
    >({
      query: (body) => ({ url: '/pricingrules', method: 'POST', body }),
      invalidatesTags: ['PricingRules'],
    }),
  }),
});

export const { useGetPricingRulesQuery, useUpdatePricingRulesMutation } = pricingApi;
