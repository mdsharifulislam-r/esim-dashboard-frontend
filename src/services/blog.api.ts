import { baseApi } from './api';
import type { ApiResponse, Blog, QueryParams } from '@/types';

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<ApiResponse<Blog>, QueryParams>({
      query: (params) => ({ url: '/blog', params }),
      providesTags: ['Blog'],
    }),
    getBlog: builder.query<{ success: boolean; data: Blog }, string>({
      query: (id) => `/blog/${id}`,
      providesTags: ['Blog'],
    }),
    createBlog: builder.mutation<{ success: boolean; message: string }, FormData>({
      query: (body) => ({ url: '/blog', method: 'POST', body }),
      invalidatesTags: ['Blog'],
    }),
    updateBlog: builder.mutation<{ success: boolean; message: string }, { id: string; data: FormData }>({
      query: ({ id, data }) => ({ url: `/blog/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Blog'],
    }),
    deleteBlog: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/blog/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Blog'],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
