import axios from 'axios'
axios.defaults.withCredentials = true
let serverURL = process.env.REACT_APP_SERVER_URL

if (process.env.NODE_ENV === 'production') {
  serverURL = "https://shrtn-backend.onrender.com"
}

export async function addLink(linkData) {
  return await axios.post(
    `${serverURL}/links`,
    linkData
  )
}

export async function deleteLink(linkid) {
  return await axios.delete(
    `${serverURL}/links/${linkid}`
  )
}

export async function getLinks(userid) {
  return await axios.get(
    `${serverURL}/users/${userid}/links`
  )
}