import React from 'react'

export default function Footer() {
  const year=new Date().getFullYear()
  return (
    <div className="footer ">
      <div className="container-fluid  " style={{background:'#363636'}}>
        <div className="row">
          <div className="col">
            <p className='text-white text-center py-2'>&copy; Copyright {year} All Rights Reserved By Ahmad</p>
          </div>
        </div>
      </div>
    </div>
  )
}
