import { baseApi } from './api';
import type { ApiResponse, User, QueryParams, ApiSingleResponse, IDashboardStats } from '@/types';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<ApiResponse<User>, QueryParams>({
      query: (params) => ({ url: '/user', params }),
      providesTags: ['Users'],
    }),
    toggleUserLock: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/user/lock/${id}`, method: 'PATCH' }),
      invalidatesTags: ['Users',],
    }),
    toggleUserStatus: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/users/${id}/toggle-status`, method: 'PATCH' }),
      invalidatesTags: ['Users'],
    }),
    deleteUser: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Users'],
    }),
    getDasboardStats: builder.query<ApiSingleResponse<IDashboardStats>, void>({
      query: () => '/admin/statistics',
    })
  }),
});

export const {
  useGetUsersQuery,
  useToggleUserLockMutation,
  useToggleUserStatusMutation,
  useDeleteUserMutation,
  useGetDasboardStatsQuery
} = usersApi;
