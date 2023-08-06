import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getLinks } from '../api/url'
import { deleteLink } from '../api/url'
import CopyModal from './copyModal'
import QRCodeModal from './qrCodeModal'

const URLs = (props) => {
    
    const { refresh, refreshCallback } = props

    const { user } = useSelector((state) => state.auth)

    const [links, setLinks] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [showCopyModal, setShowCopyModal] = useState(false)
    const [showQRModal, setShowQRModal] = useState(false)
    const [error, setError] = useState('')
    const [targetURL, setTargetURL] = useState('')
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

    const qrModalCallback = () => {
        setTargetURL('')
        setShowQRModal(false)
    }

    const copyModalCallback = () => {
        setTargetURL('')
        setShowCopyModal(false)
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
            serverURL = "https://shrtnk.onrender.com"
        }

        const shortUrl = serverURL + `/links/${link.id}`

        return (
            <tr class="bg-white border hover:bg-gray-50">
                <td className="px-4 py-2 text-center break-all"> <a href={convertToHttp(longUrl)} className="text-grey-100 hover:text-grey-700">{longUrl}</a></td>
                <td className="px-4 py-2 text-center">
                    <a href={shortUrl} className="text-grey-100 hover:text-grey-700">{shortUrl}
                    </a>
                </td>
                <td className="pt-2 text-center">
                    <button onClick={() => {
                        setShowCopyModal(true)
                        setTargetURL(shortUrl)
                        navigator.clipboard.writeText(shortUrl)
                    }}>
                        <svg class="w-[18px] h-[18px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7.708 2.292.706-.706A2 2 0 0 1 9.828 1h6.239A.97.97 0 0 1 17 2v12a.97.97 0 0 1-.933 1H15M6 5v4a1 1 0 0 1-1 1H1m11-4v12a.97.97 0 0 1-.933 1H1.933A.97.97 0 0 1 1 18V9.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.828 5h5.239A.97.97 0 0 1 12 6Z"/>
                        </svg>
                    </button>
                </td>
                <td className="px-2 pt-1.5 text-center">
                    <button onClick={() => {
                        setShowModal(true)
                        setSelectedLink({ id: link.id, URL: longUrl, ShortenedURL : shortUrl })
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                    </button>
                </td>
                <td className="px-2 pt-1.5 text-center">
                    <button onClick={() => {
                        setShowQRModal(true)
                        setTargetURL(longUrl)
                    }}>
                        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 16.9C2 15.5906 2 14.9359 2.29472 14.455C2.45963 14.1859 2.68589 13.9596 2.955 13.7947C3.43594 13.5 4.09063 13.5 5.4 13.5H6.5C8.38562 13.5 9.32843 13.5 9.91421 14.0858C10.5 14.6716 10.5 15.6144 10.5 17.5V18.6C10.5 19.9094 10.5 20.5641 10.2053 21.045C10.0404 21.3141 9.81411 21.5404 9.545 21.7053C9.06406 22 8.40937 22 7.1 22C5.13594 22 4.15391 22 3.4325 21.5579C3.02884 21.3106 2.68945 20.9712 2.44208 20.5675" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M22 7.1C22 8.40937 22 9.06406 21.7053 9.545C21.5404 9.81411 21.3141 10.0404 21.045 10.2053C20.5641 10.5 19.9094 10.5 18.6 10.5H17.5C15.6144 10.5 14.6716 10.5 14.0858 9.91421C13.5 9.32843 13.5 8.38562 13.5 6.5V5.4C13.5 4.09063 13.5 3.43594 13.7947 2.955C13.9596 2.68589 14.1859 2.45963 14.455 2.29472C14.9359 2 15.5906 2 16.9 2C18.8641 2 19.8461 2 20.5675 2.44208C20.9712 2.68945 21.3106 3.02884 21.5579 3.4325" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path> <path d="M16.5 6.25C16.5 5.73459 16.5 5.47689 16.6291 5.29493C16.6747 5.23072 16.7307 5.17466 16.7949 5.12911C16.9769 5 17.2346 5 17.75 5C18.2654 5 18.5231 5 18.7051 5.12911C18.7693 5.17466 18.8253 5.23072 18.8709 5.29493C19 5.47689 19 5.73459 19 6.25C19 6.76541 19 7.02311 18.8709 7.20507C18.8253 7.26928 18.7693 7.32534 18.7051 7.37089C18.5231 7.5 18.2654 7.5 17.75 7.5C17.2346 7.5 16.9769 7.5 16.7949 7.37089C16.7307 7.32534 16.6747 7.26928 16.6291 7.20507C16.5 7.02311 16.5 6.76541 16.5 6.25Z" fill="#1C274C"></path> <path d="M12.75 22C12.75 22.4142 13.0858 22.75 13.5 22.75C13.9142 22.75 14.25 22.4142 14.25 22H12.75ZM14.3889 13.8371L14.8055 14.4607L14.8055 14.4607L14.3889 13.8371ZM13.8371 14.3889L13.2135 13.9722L13.2135 13.9722L13.8371 14.3889ZM19 12.75H17V14.25H19V12.75ZM12.75 19V22H14.25V19H12.75ZM17 12.75C16.3134 12.75 15.742 12.7491 15.281 12.796C14.8075 12.8441 14.3682 12.9489 13.9722 13.2135L14.8055 14.4607C14.914 14.3882 15.078 14.3244 15.4328 14.2883C15.8002 14.2509 16.2822 14.25 17 14.25V12.75ZM14.25 17C14.25 16.2822 14.2509 15.8002 14.2883 15.4328C14.3244 15.078 14.3882 14.914 14.4607 14.8055L13.2135 13.9722C12.9489 14.3682 12.8441 14.8075 12.796 15.281C12.7491 15.742 12.75 16.3134 12.75 17H14.25ZM13.9722 13.2135C13.6719 13.4141 13.4141 13.6719 13.2135 13.9722L14.4607 14.8055C14.5519 14.669 14.669 14.5519 14.8055 14.4607L13.9722 13.2135Z" fill="#1C274C"></path> <path d="M22.75 13.5C22.75 13.0858 22.4142 12.75 22 12.75C21.5858 12.75 21.25 13.0858 21.25 13.5H22.75ZM20.7654 21.8478L21.0524 22.5407L21.0524 22.5407L20.7654 21.8478ZM21.8478 20.7654L21.1548 20.4784V20.4784L21.8478 20.7654ZM17 22.75H19V21.25H17V22.75ZM22.75 17V13.5H21.25V17H22.75ZM19 22.75C19.4557 22.75 19.835 22.7504 20.1454 22.7292C20.4625 22.7076 20.762 22.661 21.0524 22.5407L20.4784 21.1548C20.4012 21.1868 20.284 21.2163 20.0433 21.2327C19.7958 21.2496 19.4762 21.25 19 21.25V22.75ZM21.25 19C21.25 19.4762 21.2496 19.7958 21.2327 20.0433C21.2163 20.284 21.1868 20.4012 21.1548 20.4784L22.5407 21.0524C22.661 20.762 22.7076 20.4625 22.7292 20.1454C22.7504 19.835 22.75 19.4557 22.75 19H21.25ZM21.0524 22.5407C21.7262 22.2616 22.2616 21.7262 22.5407 21.0524L21.1548 20.4784C21.028 20.7846 20.7846 21.028 20.4784 21.1549L21.0524 22.5407Z" fill="#1C274C"></path> <path d="M2 7.1C2 5.13594 2 4.15391 2.44208 3.4325C2.68945 3.02884 3.02884 2.68945 3.4325 2.44208C4.15391 2 5.13594 2 7.1 2C8.40937 2 9.06406 2 9.545 2.29472C9.81411 2.45963 10.0404 2.68589 10.2053 2.955C10.5 3.43594 10.5 4.09063 10.5 5.4V6.5C10.5 8.38562 10.5 9.32843 9.91421 9.91421C9.32843 10.5 8.38562 10.5 6.5 10.5H5.4C4.09063 10.5 3.43594 10.5 2.955 10.2053C2.68589 10.0404 2.45963 9.81411 2.29472 9.545C2 9.06406 2 8.40937 2 7.1Z" stroke="#1C274C" stroke-width="1.5"></path> <path d="M5 6.25C5 5.73459 5 5.47689 5.12911 5.29493C5.17466 5.23072 5.23072 5.17466 5.29493 5.12911C5.47689 5 5.73459 5 6.25 5C6.76541 5 7.02311 5 7.20507 5.12911C7.26928 5.17466 7.32534 5.23072 7.37089 5.29493C7.5 5.47689 7.5 5.73459 7.5 6.25C7.5 6.76541 7.5 7.02311 7.37089 7.20507C7.32534 7.26928 7.26928 7.32534 7.20507 7.37089C7.02311 7.5 6.76541 7.5 6.25 7.5C5.73459 7.5 5.47689 7.5 5.29493 7.37089C5.23072 7.32534 5.17466 7.26928 5.12911 7.20507C5 7.02311 5 6.76541 5 6.25Z" fill="#1C274C"></path> <path d="M5 17.75C5 17.2346 5 16.9769 5.12911 16.7949C5.17466 16.7307 5.23072 16.6747 5.29493 16.6291C5.47689 16.5 5.73459 16.5 6.25 16.5C6.76541 16.5 7.02311 16.5 7.20507 16.6291C7.26928 16.6747 7.32534 16.7307 7.37089 16.7949C7.5 16.9769 7.5 17.2346 7.5 17.75C7.5 18.2654 7.5 18.5231 7.37089 18.7051C7.32534 18.7693 7.26928 18.8253 7.20507 18.8709C7.02311 19 6.76541 19 6.25 19C5.73459 19 5.47689 19 5.29493 18.8709C5.23072 18.8253 5.17466 18.7693 5.12911 18.7051C5 18.5231 5 18.2654 5 17.75Z" fill="#1C274C"></path> <path d="M16 17.75C16 17.0478 16 16.6967 16.1685 16.4444C16.2415 16.3352 16.3352 16.2415 16.4444 16.1685C16.6967 16 17.0478 16 17.75 16C18.4522 16 18.8033 16 19.0556 16.1685C19.1648 16.2415 19.2585 16.3352 19.3315 16.4444C19.5 16.6967 19.5 17.0478 19.5 17.75C19.5 18.4522 19.5 18.8033 19.3315 19.0556C19.2585 19.1648 19.1648 19.2585 19.0556 19.3315C18.8033 19.5 18.4522 19.5 17.75 19.5C17.0478 19.5 16.6967 19.5 16.4444 19.3315C16.3352 19.2585 16.2415 19.1648 16.1685 19.0556C16 18.8033 16 18.4522 16 17.75Z" fill="#1C274C"></path> </g></svg>
                    </button>
                </td>
            </tr>
        )
    }

    return (
        <>
        <table className="table-auto w-full overflow-x-auto overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-800 my-4">
            <thead>
                <tr>
                    <th className="px-4 py-2 bg-gray-300">URL</th>
                    <th className="px-4 py-2 bg-gray-300">Shortened URL</th>
                    <th className="px-4 py-2 bg-gray-300"/>
                    <th className="px-4 py-2 bg-gray-300"/>
                    <th className="px-4 py-2 bg-gray-300"/>
                </tr>
            </thead>
            <tbody>
                {links.map((link) => entries(link))}
            </tbody>
        </table>
        {showCopyModal && <CopyModal copiedURL = {targetURL} copyModalCallback={copyModalCallback} />}
        {showQRModal && <QRCodeModal  link={targetURL} qrModalCallback={qrModalCallback} />}
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
                    <div class="flex flex-wrap mx-1 mb-6 break-all">
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