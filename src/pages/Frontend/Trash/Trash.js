import React, { useState, useEffect } from 'react'
import { StarFilled } from '@ant-design/icons';
import DeleteIcon from '@mui/icons-material/Delete';
import { doc, deleteDoc } from "firebase/firestore";
import { collection, getDocs} from "firebase/firestore";
import { db } from '../../../Config/firebase'
import './trash.scss'
export default function Trash() {
  // the are state which is used for loading unloading
  const [isProcessingDelete, setIsProcessingDelete] = useState(false)
  // the are state which is used for store data  of todo which is get from firestore
  const [documents, setDocuments] = useState([])
  // It is used for read todos from the firestore of firebase and create a blank array 
  //and push data in the empty array  and set array  in the useState of document
  const fetchDocuments = async () => {
    let array = []
    const querySnapshot = await getDocs(collection(db, "trash"));
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      console.log(doc.id, " => ", doc.data());
      array.push(data)
    });
    setDocuments(array)
  }
  // UseEffect is used for display document which is get by firestore once when it it refreshing the page.
  useEffect(() => {
    fetchDocuments()
  }, [])


  //it  is used for delete a todo from the firebase  
  const handleDelete = async (todo) => {
    setIsProcessingDelete(true)
    try {
      await deleteDoc(doc(db, "trash", todo.id))
      // this logic is used for filter the document and the todo
      // which is deleted it will remove and remaining todo are displayed with refreshing the page.
      let newDocuments = documents.filter((doc) => {
        return doc.id !== todo.id
      })
      setDocuments(newDocuments)
      //logic end
      window.toastify('Todo is Deleted', 'Success')
    }
    catch (err) {
      console.error(err)
      window.toastify('Something error while deleting', 'error')
    }
    setIsProcessingDelete(false)

  }


  return (
    <>

      <div className="trash" style={{ padding: 24, minHeight: '90vh', background: '#252525', }}>
        <div className="container">
          <div className="row mb-3">
            <div className="col">
              <div className="heading d-flex  align-items-center ">
                <StarFilled className='fs-2' style={{ color: 'yellow' }} />
                <span className='text-white  fw-bold ms-2 fs-2'>Trash</span>
              </div>
            </div>
          </div>
          {documents.map((todo, i) => {
            return <div className="row py-2 px-3 mb-3 mt-3 rounded  d-flex align-items-center " key={i} style={{ backgroundColor: '#393939', color: '#757575' }}>
              <span style={{ color: 'orange' }}>{todo.date}</span>
              <div className="col-lg-3   ">
                <h5>{todo.title}</h5>
              </div>
              <div className="col-lg-3  ">
                <h5>{todo.location}</h5>
              </div>
              <div className="col-lg-3  ">
                <h5>{todo.description}</h5>
              </div>
              <div className=" col-lg-3 d-flex align-items-center px-3"  >
                {todo.status === 'deleted' && <div className="red-checkbox" />}
                <h6 className={`text-${todo.status === 'deleted' ? 'danger' : 'white'} align-items-center `}>{todo.status}</h6>
                <button className='bg-transparent border-0 px-5' onClick={() => { handleDelete(todo) }}>
                  {!isProcessingDelete ?
                    <DeleteIcon className='text-white fs-3' />
                    :
                    <div className="spinner-border spinner-border-sm"></div>
                  }
                </button>
              </div>
            </div>
          })}
        </div>
      </div>
    </>
  )
}
