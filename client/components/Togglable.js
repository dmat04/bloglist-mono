/* eslint-disable react/prop-types */
import React, { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => ({
    toggleVisibility,
  }))

  return (
    <div>
      <div style={hideWhenVisible}>
        <button type="button" onClick={toggleVisibility}>{props.labelShow}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button type="button" onClick={toggleVisibility}>{props.labelHide}</button>
      </div>
    </div>
  )
})

Togglable.propTypes = {
  labelShow: PropTypes.string.isRequired,
  labelHide: PropTypes.string.isRequired,
}

Togglable.displayName = 'Togglable'

export default Togglable
