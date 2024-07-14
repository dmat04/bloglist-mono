import { showNotification, showError } from './notificationSlice'
import { baseApi } from './baseApi'

const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: () => '/blogs',
      providesTags: (result) => (result
        ? [
          ...result.map((b) => ({ type: 'Blog', id: b.id })),
          'Blog',
        ]
        : ['Blog']),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled
        } catch {
          dispatch(showError('An error occured while fetching blogs'))
        }
      },
    }),
    getBlog: builder.query({
      query: (blogId) => `/blogs/${blogId}`,
      providesTags: (res, err, arg) => [{ type: 'Blog', id: arg }],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled
        } catch {
          dispatch(showError('An error occured while fetching a blog'))
        }
      },
    }),
    addNewBlog: builder.mutation({
      query: (blogData) => ({
        url: '/blogs',
        method: 'POST',
        body: blogData,
      }),
      invalidatesTags: (res) => [
        'Blog',
        { type: 'User', id: res.user.id },
      ],
      transformErrorResponse: () => { },
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled
          dispatch(showNotification('Blog submitted successfully'))
        } catch {
          dispatch(showError('An error occured while submitting the blog'))
        }
      },
    }),
    deleteBlog: builder.mutation({
      query: (blogData) => ({
        url: `/blogs/${blogData.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (res, err, blogData) => [
        { type: 'Blog', id: blogData.id },
        { type: 'User', id: blogData.user.id },
      ],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled
          dispatch(showNotification('Blog deleted successfully'))
        } catch {
          dispatch(showError('An error occured while deleting the blog'))
        }
      },
    }),
    updateBlog: builder.mutation({
      query: (blogData) => ({
        url: `/blogs/${blogData.id}`,
        method: 'PUT',
        body: blogData,
      }),
      invalidatesTags: (res, err, blogData) => [
        { type: 'Blog', id: blogData.id },
        { type: 'User', id: blogData.user.id },
      ],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled
          dispatch(showNotification('Blog edited successfully'))
        } catch {
          dispatch(showError('An error occured while editing the blog'))
        }
      },
    }),
    likeBlog: builder.mutation({
      query: (blogData) => ({
        url: `/blogs/${blogData.id}`,
        method: 'PUT',
        body: { ...blogData, likes: blogData.likes + 1 },
      }),
      invalidatesTags: (res, err, blogData) => [
        { type: 'Blog', id: blogData.id },
        { type: 'User', id: blogData.user.id },
      ],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled
        } catch {
          dispatch(showError('An error occured while liking the blog'))
        }
      },
    }),
    postComment: builder.mutation({
      query: ({ blog, comment }) => ({
        url: `/blogs/${blog.id}/comments`,
        method: 'POST',
        body: { comment },
      }),
      invalidatesTags: (res, err, { blog }) => [
        { type: 'Blog', id: blog.id },
      ],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled
          dispatch(showNotification('Comment posted successfully'))
        } catch {
          dispatch(showError('An error occured while posting the comment'))
        }
      },
    }),
  }),
})

export const {
  useGetBlogsQuery,
  useGetBlogQuery,
  useAddNewBlogMutation,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
  useLikeBlogMutation,
  usePostCommentMutation,
} = blogApi
