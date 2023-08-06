const CopyModal = (props) => {

    const { copyModalCallback, copiedURL } = props
    return (
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl w-96">
                <div className="min-w-xl border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <div className="relative p-6 flex-auto">
                        <div class="flex flex-wrap mx-1 mb-6">
                            <h4>
                            The Shortened URL <b>{copiedURL} </b>has been successfully copied to the clipboard
                            </h4>
                        </div>
                        <div className="flex border-t border-solid border-slate-200 rounded-b justify-end pt-4">
                            <button
                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => copyModalCallback()}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CopyModal