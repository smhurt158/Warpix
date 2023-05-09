import React from 'react'

function Popup({
    trigger,
    onClose,
    children
}) {
  return trigger ? (
    <div className='popup'>
        <div className='popup-inner'>
            {children}
            <button onClick={onClose} className='close-button'>close</button>
        </div>
    </div>
  ):""
}

export default Popup