import { baseApi } from './api';
import type { ApiResponse, PricingRulePayload, PricingRules, QueryParams } from '@/types';

type PricingRulesResponse = {
  success: boolean;
  message: string;
  pagination?: ApiResponse<PricingRules>['pagination'];
  data: PricingRules[] | PricingRules;
};

const normalizePricingRules = (response: PricingRulesResponse): ApiResponse<PricingRules> => ({
  ...response,
  pagination: response.pagination ?? { total: 0, limit: 10, page: 1, totalPage: 0 },
  data: Array.isArray(response.data) ? response.data : response.data ? [response.data] : [],
});

export const pricingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPricingRules: builder.query<ApiResponse<PricingRules>, QueryParams>({
      query: (params) => ({ url: '/pricingrules', params }),
      transformResponse: normalizePricingRules,
      providesTags: ['PricingRules'],
    }),
    createPricingRule: builder.mutation<{ success: boolean; message: string }, PricingRulePayload>({
      query: (body) => ({ url: '/pricingrules', method: 'POST', body }),
      invalidatesTags: ['PricingRules'],
    }),
    updatePricingRule: builder.mutation<
      { success: boolean; message: string },
      { id: string; data: Partial<PricingRulePayload> }
    >({
      query: ({ id, data }) => ({ url: `/pricingrules/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['PricingRules'],
    }),
    deletePricingRule: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/pricingrules/${id}`, method: 'DELETE' }),
      invalidatesTags: ['PricingRules'],
    }),
  }),
});

export const {
  useGetPricingRulesQuery,
  useCreatePricingRuleMutation,
  useUpdatePricingRuleMutation,
  useDeletePricingRuleMutation,
} = pricingApi;
