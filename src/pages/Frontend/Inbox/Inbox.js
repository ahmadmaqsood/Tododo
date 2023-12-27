import React from 'react'
import { StarFilled } from '@ant-design/icons';
export default function Inbox() {
  return (
    <div className="inbox" style={{ padding: 24, minHeight:'90vh', background: '#252525', }}>
    <div className="container">
      <div className="row mb-3">
        <div className="col">
          <div className="heading d-flex  align-items-center ">
            <StarFilled className='fs-2' style={{color:'yellow'}} />
            <span className='text-white  fw-bold ms-2 fs-2'>Inbox</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
