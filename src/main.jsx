import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { UserContextProvider } from './context/userContext'
import { PlaceContextProvider } from './context/placeContext.jsx'
import { BookingContextProvider } from './context/bookingContext'
import { ThemeMoodProvider } from './context/themeMoodContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserContextProvider>
        <PlaceContextProvider>
          <BookingContextProvider>
            <ThemeMoodProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </ThemeMoodProvider>
          </BookingContextProvider>
        </PlaceContextProvider>
    </UserContextProvider>
  </React.StrictMode>,
)
