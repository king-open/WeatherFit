import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light'
  }
})

const VuetifyProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-app>{children}</div>
}

const rootElement = document.getElementById('root')
if (!rootElement?.innerHTML) {
  const root = ReactDOM.createRoot(rootElement!)
  root.render(
    <React.StrictMode>
      <VuetifyProvider>
        <App />
      </VuetifyProvider>
    </React.StrictMode>
  )
}
