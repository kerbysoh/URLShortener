import { useSelector } from 'react-redux'
import '../index.css'
import logo from '../images/shr.tn_logo.png'
import { useDispatch } from 'react-redux'
import { onLogout } from '../api/auth'
import { unauthenticateUser } from '../redux/slices/authSlice'

const Navbar = () => {
  const { isAuth } = useSelector((state) => state.auth)

  const dispatch = useDispatch()

  const logout = async () => {
    try {
      await onLogout()

      dispatch(unauthenticateUser())
      localStorage.removeItem('isAuth')
      localStorage.removeItem('user')
    } catch (error) {
      console.log(error.response)
    }
  }

  return (
      <div>
        {isAuth &&
          <nav class="bg-purple-100 border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-800 w-full">
          <div class="flex flex-wrap justify-between items-center w-full">
            <div>
              <a href="/dashboard" class="flex items-center">
                  <img src={logo} alt="No logo available" class="mr-6 h-9 sm:h-16"/>
              </a>
            </div>
            <div class="hidden w-full md:block md:w-auto justify-end" id="mobile-menu">
              <ul class="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
                <li>
                  <button onClick={() => logout()} class="cursor-pointer bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-3 rounded">Logout</button> 
                </li>
              </ul>
            </div>
          </div>
        </nav>
        }
      </div>
  )
}

export default Navbar