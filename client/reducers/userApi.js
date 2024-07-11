import { baseApi } from './baseApi'

const userApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getUsers: builder.query({
      query: () => '/users',
      providesTags: (result = []) => [
        'User',
        ...result.map(({ id }) => ({ type: 'User', id }))
      ]
    }),
    getUser: builder.query({
      query: userId => `/users/${userId}`,
      providesTags: (res, err, userId) => [{ type: 'User', id: userId }]
    })
  })
})

export const {
  useGetUsersQuery,
  useGetUserQuery
} = userApi