import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getLinks } from '../api/url'
import { deleteLink } from '../api/url'

const URLs = (props) => {
    
    const { refresh, refreshCallback } = props

    const { user } = useSelector((state) => state.auth)

    const [links, setLinks] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [error, setError] = useState('')
    const [selectedLink, setSelectedLink] = useState({ id: '', URL: '', ShortenedURL : '' })

    useEffect(() => {
        getLinks(user.id.toString())
        .then(res => setLinks(res.data))
    }, [user.id, refresh])

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            await deleteLink(selectedLink.id)
            setError('')
            setShowModal(false)
            refreshCallback()
        } catch (error) {
            if (error.response.data === {}) {
                setError(error.response.data?.errors[0].msg)
            } else {
                setError(error.message)
            }
        }
    }

    const convertToHttp = (url) => {
        const httpPattern = /^((http|https|ftp):\/\/)/;
        if(!httpPattern.test(url)) {
            url = "http://" + url
        }
        return url
    }

    const entries = (link) => {
        const longUrl = link.url

        let serverURL = process.env.REACT_APP_SERVER_URL

        if (process.env.NODE_ENV === 'production') {
            serverURL = "https://shrtn-backend.onrender.com"
        }

        const shortUrl = serverURL + `/links/${link.id}`

        return (
            <tr class="bg-white border hover:bg-gray-50">
                <td className="px-4 py-2 text-center"> <a href={convertToHttp(longUrl)} className="text-grey-100 hover:text-grey-700">{longUrl}</a></td>
                <td className="px-4 py-2 text-center"><a href={shortUrl} className="text-grey-100 hover:text-grey-700">{shortUrl}</a></td>
                <td className="px-4 py-2 text-center">
                    <button onClick={() => {
                        setShowModal(true)
                        setSelectedLink({ id: link.id, URL: longUrl, ShortenedURL : shortUrl })
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                    </button>
                </td>
            </tr>
        )
    }

    return (
        <>
        <table className="table-auto w-full overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-800 my-4">
            <thead>
                <tr>
                    <th className="px-4 py-2 bg-gray-300">URL</th>
                    <th className="px-4 py-2 bg-gray-300">Shortened URL</th>
                    <th className="px-4 py-2 bg-gray-300"/>
                </tr>
            </thead>
            <tbody>
                {links.map((link) => entries(link))}
            </tbody>
        </table>
        {showModal && (
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-3xl w-96">
                    <div className="min-w-xl border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                            <h3 className="text-3xl font-semibold">
                                Delete link
                            </h3>
                            <button
                                className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                onClick={() => setShowModal(false)}
                            >
                            <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                            ×
                            </span>
                            </button>
                        </div>
                <div className="relative p-6 flex-auto">
                    <p className="my-1 text-slate-500 text-lg leading-relaxed">
                    <form onSubmit={(e) => onSubmit(e)} vclass="w-full">
                    <div class="flex flex-wrap mx-1 mb-6">
                        <h4>
                        Confirm to delete the link <b>{selectedLink.ShortenedURL}</b> for <b>{selectedLink.URL} </b>
                        </h4>
                    </div>
                    {error && 
                    <div id="alert-2" class="flex p-4 mb-4 bg-red-100 rounded-lg dark:bg-red-200" role="alert">
                        <svg class="flex-shrink-0 w-5 h-5 text-red-700 dark:text-red-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
                        <div class="ml-3 text-sm font-medium text-red-700 dark:text-red-800">
                            <span>{error}</span>
                        </div>
                    </div>
                    }
                    <div className="flex p-6 border-t border-solid border-slate-200 rounded-b justify-end space-x-4">
                        <button
                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={() =>  {
                                setShowModal(false)
                                setSelectedLink({ id: '', URL: '', ShortenedURL : '' })
                                setError('')
                            }
                            }
                        >
                            Close
                        </button>
                        <button
                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="submit"
                        >
                        Confirm
                        </button>
                    </div>
                    </form>
                    </p>
                </div>
                </div>
                </div>
            </div>
            )}
        </>
    )
}

export default URLs