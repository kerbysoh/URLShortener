import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchProtectedInfo, onLogout } from '../api/auth'
import Layout from '../components/layout'
import URLs from '../components/URLs'
import Menu from '../components/menu'
import { unauthenticateUser } from '../redux/slices/authSlice'

const Dashboard = () => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(false)

  const refreshCallback = () => {
    setRefresh(!refresh)
  }

  useEffect(() => {
    const logout = async () => {
      try {
        await onLogout()
        dispatch(unauthenticateUser())
        localStorage.removeItem('isAuth')
      } catch (error) {
        console.log(error.response)
      }
    }
    const protectedInfo = async () => {
      try {
        await fetchProtectedInfo()
        setLoading(false)
      } catch (error) {
        logout()
    }
  }
    protectedInfo()
  }, [dispatch])

  return loading ? (
    <Layout>
      <h1>Loading...</h1>
    </Layout>
  ) : (
    <div class="bg-purple-100">
      <Layout>
        <div class="flex space-x-4 m-4">
          <URLs refresh={refresh} refreshCallback={refreshCallback} />
          <Menu refreshCallback={refreshCallback} />
        </div>
      </Layout>
    </div>
  )
}

export default Dashboard