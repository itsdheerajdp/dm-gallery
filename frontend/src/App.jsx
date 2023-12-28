import './App.css'
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom'
import LoginPage from './UserComponents/LoginPage.jsx'
import SignUpPage from './UserComponents/SignUpPage.jsx'
import HomePage from './UserComponents/HomePage.jsx'
import UserPage from './UserComponents/UserPage.jsx'
import UserAccountDetailPage from './UserComponents/UserAccountDetailPage.jsx'
import EditAccountDetailPage from './UserComponents/EditAccountDetailPage.jsx'
function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<LoginPage/>}/> 
        <Route path='/signup' element={<SignUpPage/> }/>
        <Route path='/userPage' element={<UserPage/>}/> 
        <Route path='/users/account-detail' element={<UserAccountDetailPage/>}></Route>
        <Route path='/users/account-detail/edit-account-detail' element={<EditAccountDetailPage/>}></Route>
      </Routes>
    </Router>
    </>
  )
}

export default App
