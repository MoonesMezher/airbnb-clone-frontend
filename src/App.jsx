import { Routes, Route, Navigate } from 'react-router-dom'
// import components & hooks
import Login from "./pages/Login"
import Layout from "./Layout"
import Signup from './pages/Signup'
import Home from './pages/Home'
import Logout from './pages/Logout'
import { useUserContext } from './hooks/useUserContext'
import Account from './pages/Account'
import AddNewPlace from './components/AddNewPlace'
import PlaceDetails from './components/PlaceDetails'
import SeeAllPhotos from './components/SeeAllPhotos'
import UserDetails from './components/UserDetails'
import BookingDetails from './components/BookingDetails'
import UpdateBooking from './components/UpdateBooking'

function App() {
  const { user } = useUserContext();

  return (
      <Layout>
        <Routes>
          <Route path='/' element={user? <Home/>: <Navigate to={'/login'}/>}/>
          <Route path="/login" element={!user? <Login/>: <Navigate to={'/'}/>}/>
          <Route path="/signup" element={!user? <Signup/>: <Navigate to={'/'}/>}/>
          <Route path="/logout" element={user? <Logout/>: <Navigate to={'/login'}/>}/>
          <Route path="/account/:subpage?" element={user? <Account/>: <Navigate to={'/login'}/>}/>
          <Route path="/account/:subpage/addnew" element={user? <AddNewPlace/>: <Navigate to={'/login'}/>}/>
          <Route path="/account/:subpage/update/:id" element={user? <AddNewPlace/>: <Navigate to={'/login'}/>}/>
          <Route path="/place/:id" element={user? <PlaceDetails/>: <Navigate to={'/login'}/>}/>
          <Route path="/place/:id/photos" element={user? <SeeAllPhotos/>: <Navigate to={'/login'}/>}/>
          <Route path="/user/:id/" element={user? <UserDetails/>: <Navigate to={'/login'}/>}/>
          <Route path="/booking/:id/" element={user? <BookingDetails/>: <Navigate to={'/login'}/>}/>
          <Route path="/booking/update/:id/" element={user? <UpdateBooking/>: <Navigate to={'/login'}/>}/>
        </Routes>
      </Layout>
  )
}

export default App
