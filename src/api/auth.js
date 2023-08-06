import axios from 'axios'
axios.defaults.withCredentials = true
let serverURL = process.env.REACT_APP_SERVER_URL

if (process.env.NODE_ENV === 'production') {
  serverURL = "https://shrtn-backend.onrender.com"
}

export async function onRegistration(registrationData) {
  return await axios.post(
    `${serverURL}/register`,
    registrationData
  )
}

export async function onLogin(loginData) {
  return await axios.post(`${serverURL}/login`, loginData)
}

export async function onLogout() {
  return await axios.get(`${serverURL}/logout`)
}

export async function fetchProtectedInfo() {
  return await axios.get(`${serverURL}/protected`)
}