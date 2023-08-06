import { useState } from "react"
import { useSelector } from 'react-redux'
import { addLink } from '../api/url'

const Menu = (props) => {

    const { refreshCallback } = props

    const { user } = useSelector((state) => state.auth)
    
    const [showModal, setShowModal] = useState(false)
    const [values, setValues] = useState({
        link: '',
        userid: user.id.toString(),
    })
    const [error, setError] = useState('')

    const onChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value })
    }

    const isValidUrl = urlString => {
        const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
                                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
                                    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
                                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
                                    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
                                    '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
        return !!urlPattern.test(urlString);
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            if (!isValidUrl(values.link)) {
                console.log(values)
                setError("Please key in a valid URL.")
                return
            }
            await addLink(values)
            setValues({
                link: '',
                userid: user.id.toString(),
            })
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
    
    return (
        <>
            <div class="flex justify-center">
                <aside class="w-64" aria-label="Sidebar">
                    <div class="overflow-y-auto py-4 px-3 bg-gray-50 rounded dark:bg-gray-800 my-4">
                        <ul class="space-y-2">
                            <li onClick={() => setShowModal(true)}>
                                <button className=" w-full flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-square-fill" viewBox="0 0 16 16">
                                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z"/>
                                    </svg>
                                    <span class="ml-3">Add new link</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
            {showModal && (
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-3xl min-w-[50%]">
                    <div className="min-w-xl border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                        <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                            <h3 className="text-3xl font-semibold">
                                Add new link
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
                    <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    <form onSubmit={(e) => onSubmit(e)} vclass="w-full max-w-lg">
                    <div class="flex flex-wrap -mx-3 mb-6">
                        <div class="w-full px-3 mb-6 md:mb-0">
                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                Link
                            </label>
                            <input onChange={(e) => onChange(e)} value={values.link} name='link' class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text"/>
                        </div>
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
                                setError('')
                                setValues({
                                    link: '',
                                    userid: user.id.toString(),
                                })
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

export default Menu