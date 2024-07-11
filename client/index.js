import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import store from './store'

import App from 'Components/App'

const refresh = () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  )
}

refresh()

if (module.hot) {
  module.hot.accept()
}
