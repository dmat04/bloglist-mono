import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import App from 'Components/App'
import store from './store'

const refresh = () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>,
  )
}

refresh()

if (module.hot) {
  module.hot.accept()
}
