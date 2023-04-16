import { useState, useCallback, useEffect } from 'react'

import { useHttpClient } from './httpRequest'

export const useGetPosts = () => {
  const [posts, setPosts] = useState([])

  const { sendRequest, isLoading, error } = useHttpClient()

  const fetchPosts = useCallback(async () => {
    try {
      const responseData = await sendRequest('/posts/all')
      if (responseData.posts) {
        const sortedPosts = responseData.posts.sort(
          (a, b) =>
            new Date(b?.createdAt ? b.createdAt : b.updatedAt).getTime() -
            new Date(a?.createdAt ? a.createdAt : a.updatedAt).getTime()
        )
        setPosts(sortedPosts)
        console.log(sortedPosts)
      }
    } catch (err) {
      console.log(err)
      // alert(err.message)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return { posts, isLoading, error, fetchPosts }
}

export const useGetUserPosts = username => {
  const [posts, setPosts] = useState([])

  const { sendRequest, isLoading, error } = useHttpClient()

  const fetchPosts = useCallback(async username => {
    try {
      const responseData = await sendRequest('/posts/user/' + username)
      if (responseData.posts) {
        const sortedPosts = responseData.posts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setPosts(sortedPosts)
        console.log(sortedPosts)
      }
    } catch (err) {
      console.log(err)
      // alert(err.message)
    }
  }, [])

  useEffect(() => {
    fetchPosts(username)
  }, [fetchPosts])

  return { posts, isLoading, error, fetchPosts }
}
