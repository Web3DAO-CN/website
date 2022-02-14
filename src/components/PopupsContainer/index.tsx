import { Times } from 'components/FontawesomeIcon'
import { ToastContainer } from 'react-toastify'
import './toast.custom.css'

function CloseButton({ closeToast }: { closeToast: () => void }) {
  return (
    <button 
      onClick={closeToast}
      type='button' 
      className='self-start flex items-center justify-center p-1 text-[#A5A2B0]'
    >
      <Times size={12} />
    </button>
  )
}

export default function PopupsContainer() {
  return (
    <ToastContainer
      position='top-right'
      autoClose={false}
      closeOnClick={false}
      // hideProgressBar={true}
      newestOnTop={false}
      rtl={false}
      pauseOnFocusLoss
      draggable={false}
      pauseOnHover
      closeButton={CloseButton}
      className="right-10"
    />
  )
}
