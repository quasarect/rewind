import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

import PostUI from '../components/posts/Post'

import { useHttpClient } from '../hooks/httpRequest'

function Post() {
  const { postId } = useParams()

  const { sendRequest, isLoading } = useHttpClient()

  const navigate = useNavigate()

  const [post, setPost] = useState(null)

  const [comments, setComments] = useState([])

  const fetchPost = useCallback(async () => {
    try {
      const promises = [
        sendRequest(`/posts/${postId}`),
        sendRequest(`/posts/${postId}/comments`),
      ]

      const [res1, res2] = await Promise.all(promises)

      if (res1.post) {
        setPost(res1.post)
      } else {
        navigate('/404')
      }

      if (res2.posts) {
        setComments(
          res2.posts.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        )
      } else {
        navigate('/404')
      }
    } catch (error) {
      console.log(error)
      navigate('/404')
    }
  }, [sendRequest, navigate])

  useEffect(() => {
    fetchPost(postId)
  }, [fetchPost, postId])

  return (
    <main className="w-full md:w-4/5 lg:w-2/5 bg-rewind-dark-primary">
      <div className="p-4 text-poppins text-gray-200 text-xl border-b border-rewind-dark-tertiary">
        Rewind
      </div>
      {isLoading ? (
        <span
          className="
          flex mt-4 justify-center w-full h-full text-poppins text-gray-200 text-xl
        "
        >
          Loading..
        </span>
      ) : (
        <>
          <PostUI post={post} redirect={false} onComment={fetchPost} />
          <div className="p-4 text-poppins text-gray-200 text-xl border-b border-rewind-dark-tertiary bg-rewind-dark-primary">
            Comments ⇣
          </div>
          {comments.length === 0 && (
            <div className="p-4 text-manrope text-gray-200 text-md ">
              No comments yet. Be the first one to comment :)
            </div>
          )}

          {comments.map((comment) => (
            <PostUI
              key={comment._id}
              post={comment}
              redirect={true}
              onComment={() => {
                navigate(`/post/${comment._id}`)
              }}
            />
          ))}
        </>
      )}
    </main>
  )
}

export default Post
