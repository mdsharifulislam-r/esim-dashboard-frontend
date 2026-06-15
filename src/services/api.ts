import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.linkfastesim.com/api/v1',
    // baseUrl: 'http://10.10.26.164:5000/api/v1',

    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    'Users',
    'Influencer',
    'Blog',
    'Coupon',
    'Faq',
    'Review',
    'Support',
    'Disclaimer',
    'Discount',
    'Auth',
    'Notification',
    'Dashboard',
    'Banner',
    'Admin',
  ],
  endpoints: () => ({}),
});


export const imageUrl = 'https://api.linkfastesim.com';
// export const imageUrl = 'http://10.10.26.164:5000';

export const getImageUrl = (path: string) => {
  if (path.startsWith('http')) {
    return path;
  }


  return `${imageUrl}/files${path}`
};