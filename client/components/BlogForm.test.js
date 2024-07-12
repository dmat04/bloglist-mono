/**
 * @jest-environment jsdom
 */
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let container
  let submitHandler

  beforeEach(() => {
    submitHandler = jest.fn()

    container = render(<BlogForm submitHandler={submitHandler} />).container
  })

  test('calls the submit handler with correct data', async () => {
    const inputData = {
      title: 'This is a test blog',
      author: 'Test Author',
      url: 'www.testurl.com/blog',
    }

    const root = container.querySelector('.blogFormRoot')
    expect(root).toBeDefined()

    const submitButton = container.querySelector('.btnSubmit')
    const inputTitle = container.querySelector('.inputTitle')
    const inputAuthor = container.querySelector('.inputAuthor')
    const inputUrl = container.querySelector('.inputUrl')

    expect(submitButton).toBeDefined()
    expect(inputTitle).toBeDefined()
    expect(inputAuthor).toBeDefined()
    expect(inputUrl).toBeDefined()

    const user = userEvent.setup()
    await user.type(inputTitle, inputData.title)
    await user.type(inputAuthor, inputData.author)
    await user.type(inputUrl, inputData.url)
    await user.click(submitButton)

    expect(submitHandler.mock.calls).toHaveLength(1)
    expect(submitHandler.mock.calls[0][0]).toEqual(inputData)
  })
})

export default {}
