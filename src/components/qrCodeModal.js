const QRCodeModal = (props) => {

    const { link, qrModalCallback } = props

    const generateQRLink = (url) => {
        return `https://api.qrserver.com/v1/create-qr-code/?data=${url}&amp;size=100x100`
    }

    return (
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl w-96">
                <div className="min-w-xl border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <div className="relative p-6 flex-auto">
                        <div className="relative p-6 flex-auto">
                            <img src={generateQRLink(link)} alt="" title="" />
                        </div>
                        <div className="flex border-t border-solid border-slate-200 rounded-b justify-end pt-4">
                            <button
                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                type="button"
                                onClick={() => qrModalCallback()}
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

export default QRCodeModal