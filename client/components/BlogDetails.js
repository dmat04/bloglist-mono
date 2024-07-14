/* eslint-disable no-console */
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useMatch } from 'react-router-dom'
import {
  Card, Row, Col, Button, Modal, Spinner,
} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
// import { useState } from 'react'
import Comments from './Comments'
import { prettyCount, NotFound } from '../util/common'
import { useGetBlogsQuery, useDeleteBlogMutation, useLikeBlogMutation } from '../reducers/blogApi'

const BlogDetails = () => {
  const match = useMatch('/blogs/:id')
  const navigate = useNavigate()
  const auth = useSelector((state) => state.auth)
  const [showDialog, setShowDialog] = useState(false)

  const {
    blog,
    isLoading,
    isSuccess,
    isError,
  } = useGetBlogsQuery(undefined, {
    selectFromResult: (result) => ({
      blog: result.data?.find((b) => b.id === match.params.id),
      isLoading: result.isLoading,
      isSuccess: result.isSuccess,
      isError: result.isError,
    }),
  })

  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation()
  const [likeBlog, { isLoading: isLiking }] = useLikeBlogMutation()

  if (isError || (isSuccess && !blog)) return <NotFound message="Blog not found" />

  if (isLoading) return <div>Loading</div>

  if (isSuccess && blog) {
    let deleteHanlder = null
    if (auth?.username === blog?.user.username) {
      deleteHanlder = () => {
        setShowDialog(true)
      }
    }

    const deleteAction = async () => {
      try {
        const res = await deleteBlog(blog)
        setShowDialog(false)
        if (!res.error) {
          navigate('/blogs')
        }
      } catch (ex) {
        console.log(ex)
      }
    }

    const likeHandler = async () => {
      try {
        await likeBlog(blog)
      } catch (ex) {
        console.log(ex)
      }
    }

    return (
      <>
        <Card className="mb-3">
          <Card.Body>
            <Card.Title as="h4">
              {blog.title}
            </Card.Title>
            <Card.Subtitle>
              <Row className="mt-4">
                <Col>
                  <Card.Link
                    className="text-decoration-none"
                    href={blog.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {blog.url}
                  </Card.Link>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col xs="auto">
                  {prettyCount(blog.comments.length, 'comment', 'comments', '0 comments')}
                </Col>
                <Col xs="auto">
                  {prettyCount(blog.likes, 'like', 'likes', '0 likes')}
                </Col>
                <Col xs="auto">
                  <span>Added by </span>
                  <LinkContainer to={`/users/${blog.user.id}`}>
                    <Card.Link className="text-decoration-none">
                      {blog.user.name}
                    </Card.Link>
                  </LinkContainer>
                </Col>
              </Row>
            </Card.Subtitle>
          </Card.Body>
          <Card.Footer>
            <Button
              className="me-2"
              size="sm"
              variant="success"
              onClick={likeHandler}
            >
              Like
              {
                isLiking
                && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="ms-2"
                />
                )
              }
            </Button>
            {
              deleteHanlder
              && (
              <Button
                size="sm"
                variant="danger"
                onClick={deleteHanlder}
              >
                Delete blog
              </Button>
              )
            }
          </Card.Footer>
        </Card>

        <Comments blog={blog} />

        <Modal show={showDialog} onHide={() => setShowDialog(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm blog detetion</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this blog?</Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={deleteAction}>
              {
                isDeleting
                && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                )
              }
              Yes
            </Button>
            <Button variant="primary" onClick={() => { setShowDialog(false) }}>
              No
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }

  return null
}
export default BlogDetails
