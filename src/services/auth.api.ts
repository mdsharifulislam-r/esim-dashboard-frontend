import { baseApi } from './api';
import type { ApiResponse, ApiSingleResponse, AuthUser, Notification, NotificationResponse } from '@/types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ data: { accessToken: string,role: string }; success: boolean; message: string }, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      invalidatesTags: ['Auth'],
    }),
    forgotPassword: builder.mutation<{ success: boolean; message: string }, { email: string }>({
      query: (body) => ({ url: '/auth/forget-password', method: 'POST', body }),
    }),
    verifyOtp: builder.mutation<{ success: boolean; message: string; data: string }, { email: string; oneTimeCode: number }>({
      query: (body) => ({ url: '/auth/verify-email', method: 'POST', body }),
    }),
    resetPassword: builder.mutation<{ success: boolean; message: string }, { newPassword:string,confirmPassword: string,token: string }>({
      query: (body) => {
        
        return { url: '/auth/reset-password', method: 'POST', body}
      },
    }),
    changePassword: builder.mutation<{ success: boolean; message: string }, any>({
      query: (body) => ({ url: '/auth/change-password', method: 'POST', body }),
    }),
    getProfile: builder.query<ApiSingleResponse<AuthUser>, void>({
      query: () => '/user/profile',
      providesTags: ['Auth'],
    }),
    updateProfile: builder.mutation<ApiSingleResponse<AuthUser>, FormData>({
      query: (body) => ({ url: '/user/profile', method: 'PATCH', body }),
      invalidatesTags: ['Auth'],
    }),
    getNotifications: builder.query<ApiSingleResponse<NotificationResponse>, any>({
      query: (params) => {
        return {
          url: '/notification',
          params,
        };
      },
      providesTags: ['Notification'],
    }),
    markNotificationsRead: builder.mutation<{ success: boolean }, void>({
      query: () => ({ url: '/notification', method: 'PATCH' }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
} = authApi;
