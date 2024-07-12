import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { showNotification, showError } from './notificationSlice'

export const baseApi = createApi({
  reducerPath: 'service',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth
      if (token?.token) {
        headers.set('Authorization', `Bearer ${token.token}`)
      }

      return headers
    },
  }),
  endpoints: (builder) => ({
    doLogin: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const res = await queryFulfilled
          if (res.data) {
            dispatch(showNotification('Login successful'))
          }
        } catch (ex) {
          const err = ex.error
          if (err.status === 401) {
            dispatch(showError('Wrong credentials'))
          } else {
            dispatch(showError('An error occured while performing login'))
          }
        }
      },
    }),
    // getBlogs: builder.query({
    //   query: () => '/blogs',
    //   providesTags: (result, err, arg) => {
    //     return result
    //       ? [
    //         ...result.map(b => ({ type: 'Blog', id: b.id })),
    //         'Blog'
    //       ]
    //       : ['Blog']
    //   },
    //   onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
    //     try {
    //       await queryFulfilled
    //     } catch {
    //       dispatch(showError('An error occured while fetching blogs'))
    //     }
    //   }
    // }),
    // getBlog: builder.query({
    //   query: blogId => `/blogs/${blogId}`,
    //   providesTags: (res, err, arg) => [{ type: 'Blog', id: arg }],
    //   onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
    //     try {
    //       await queryFulfilled
    //     } catch {
    //       dispatch(showError('An error occured while fetching a blog'))
    //     }
    //   }
    // }),
    // addNewBlog: builder.mutation({
    //   query: blogData => ({
    //     url: '/blogs',
    //     method: 'POST',
    //     body: blogData
    //   }),
    //   invalidatesTags: (res, err, arg) => [
    //     'Blog',
    //     { type: 'User', id: res.user.id }
    //   ],
    //   transformErrorResponse: () => { },
    //   onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
    //     try {
    //       await queryFulfilled
    //       dispatch(showNotification('Blog submitted successfully'))
    //     } catch {
    //       dispatch(showError('An error occured while submitting the blog'))
    //     }
    //   }
    // }),
    // deleteBlog: builder.mutation({
    //   query: blogData => ({
    //     url: `/blogs/${blogData.id}`,
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: (res, err, blogData) => [
    //     { type: 'Blog', id: blogData.id },
    //     { type: 'User', id: blogData.user.id }
    //   ],
    //   onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
    //     try {
    //       await queryFulfilled
    //       dispatch(showNotification('Blog deleted successfully'))
    //     } catch {
    //       dispatch(showError('An error occured while deleting the blog'))
    //     }
    //   }
    // }),
    // updateBlog: builder.mutation({
    //   query: blogData => ({
    //     url: `/blogs/${blogData.id}`,
    //     method: 'PUT',
    //     body: blogData
    //   }),
    //   invalidatesTags: (res, err, blogData) => [
    //     { type: 'Blog', id: blogData.id },
    //     { type: 'User', id: blogData.user.id }
    //   ],
    //   onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
    //     try {
    //       await queryFulfilled
    //       dispatch(showNotification('Blog edited successfully'))
    //     } catch {
    //       dispatch(showError('An error occured while editing the blog'))
    //     }
    //   }
    // }),
    // likeBlog: builder.mutation({
    //   query: blogData => ({
    //     url: `/blogs/${blogData.id}`,
    //     method: 'PUT',
    //     body: { ...blogData, likes: blogData.likes + 1 }
    //   }),
    //   invalidatesTags: (res, err, blogData) => [
    //     { type: 'Blog', id: blogData.id },
    //     { type: 'User', id: blogData.user.id }
    //   ],
    //   onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
    //     try {
    //       await queryFulfilled
    //     } catch {
    //       dispatch(showError('An error occured while liking the blog'))
    //     }
    //   }
    // }),
    // postComment: builder.mutation({
    //   query: ({ blog, comment }) => ({
    //     url: `/blogs/${blog.id}/comments`,
    //     method: 'POST',
    //     body: { comment }
    //   }),
    //   invalidatesTags: (res, err, { blog, comment }) => [
    //     { type: 'Blog', id: blog.id }
    //   ],
    //   onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
    //     try {
    //       await queryFulfilled
    //       dispatch(showNotification('Comment posted successfully'))
    //     } catch {
    //       dispatch(showError('An error occured while posting the comment'))
    //     }
    //   }
    // }),
    // getUsers: builder.query({
    //   query: () => '/users',
    //   providesTags: (result = [], err, arg) => [
    //     'User',
    //     ...result.map(({ id }) => ({ type: 'User', id }))
    //   ]
    // }),
    // getUser: builder.query({
    //   query: userId => `/users/${userId}`,
    //   providesTags: (res, err, userId) => [{ type: 'User', id: userId }]
    // })
  }),
})

export const {
  useDoLoginMutation,
} = baseApi
