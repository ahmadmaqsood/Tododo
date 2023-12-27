import React, { useContext, useState } from 'react'
import { StarFilled } from '@ant-design/icons';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { db } from '../../../Config/firebase';
import { collection, query, where, getDocs, setDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { AuthContext } from '../../../context/AuthContext';
import './someday.scss'

const initialState = { title: '', location: '', date: '', description: '' }

export default function Someday() {
  // the are state which is used for store data  of todo which is get from firestore
  const [documents, setDocuments] = useState([])
  // handlechange is used for getting data from the inputDateField and set in the state
  const [state, setState] = useState({ dated: '' })
  // the are state which is used for store data  of todo which is get from input field of modal
  const [editTodo, setEditTodo] = useState(initialState)
  // the are state which is used for loading unloading
  const [isProcessingDelete, setIsProcessingDelete] = useState(false)
  const [isProcessingUpdate, setIsProcessingUpdate] = useState(false)

  // Get user from the AuthContext by using useContext
  const { user } = useContext(AuthContext)

  //HandleDate to get data from the field od date
  const handleDate = (e) => {
    const { name, value } = e.target;
    setState(s => ({ ...s, [name]: value }))
  }
  // HandleChange to get data from the fields of Modal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditTodo(s => ({ ...s, [name]: value }))
  }

  // It is used for read todos from the firestore of firebase and create a blank array 
  //and push data in the empty array  and set array  in the useState of document
  const fetchDocument = async () => {
    const { dated } = state
    const q = query(collection(db, "todos"), where('date', "==", dated));
    const array = []
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(doc.id, " => ", doc.data());
      array.push(data)
    });
    setDocuments(array)
  }

  //This Function is first add todo in another collection as trash then at second
  //it  is used for delete a todo from the firebase as well as ui and 
  const handleDelete = async (todo) => {
    todo.status = 'deleted'
    setIsProcessingDelete(true)
    try {
      //deleted todo is set in the trash collection in the firetore
      await setDoc(doc(db, "trash", todo.id), todo)
        // todo is deleted 
        .then(async () => {
          await deleteDoc(doc(db, "todos", todo.id));
          // this logic is used for filter the document and the todo
          // which is deleted it will remove and remaining todo are displayed with refreshing the page.
          let newDocuments = documents.filter((doc) => {
            return doc.id !== todo.id
          })
          setDocuments(newDocuments)
          //logic end
          window.toastify('Todo is Deleted', 'success')
        })
    }
    catch (err) {
      console.error(err)
      window.toastify('Something is error', 'error')
    }
    setIsProcessingDelete(false)
  }

  // This Function is used for edit a todo and update it by new value.
  const handleUpdate = async () => {
    const todas = { ...editTodo }
    todas.dateCreated = todas.dateCreated
    todas.dateModified = serverTimestamp()
    todas.modifiedBy = {
      email: user.email,
      uid: user.uid
    }
    setIsProcessingUpdate(true)
    try {
      await setDoc(doc(db, "todos", todas.id), todas, { merge: true });
      window.toastify('Todo is Updated Successfully', 'success')
      // This is used by replace old todo by updated todo with refreshing the page
      //logic start
      let newDocuments = documents.map((doc) => {
        if (doc.id === todas.id)
          return todas
        return doc
      })
      setDocuments(newDocuments)
      //logic end
    }
    catch (err) {
      console.error(err)
      window.toastify('Something is error', 'error')
    }
    setIsProcessingUpdate(false)
  }
  return (
    <>
      <div className="someday" style={{ padding: 24, minHeight: '90vh', background: '#252525', }}>
        <div className="container">
          <div className="row mb-3">
            <div className="col">
              <div className="heading d-flex  align-items-center ">
                <StarFilled className='fs-2' style={{ color: 'yellow' }} />
                <span className='text-white  fw-bold ms-2 fs-2'>Someday</span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col d-flex">
              <input type="date" name='dated' className='form-control border-0 w-25  ' onChange={handleDate} />
              <button className='btn btn-warning  text-white' onClick={fetchDocument} >Check Todo</button>
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
              <div className="col-lg-3  d-flex align-items-center"  >
                {todo.status === 'active' && <div className="green-checkbox" />}
                <h6 className={`text-${todo.status === 'active' ? 'info' : 'white'} align-items-center  `}>{todo.status}</h6>
                <button type="button" class="btn bg-transparent" data-bs-toggle="modal" data-bs-target="#exampleModal">
                  <EditNoteIcon className='text-white ms-4 fs-2 ' onClick={() => { setEditTodo(todo) }} />
                </button>
                <button className='bg-transparent border-0' onClick={() => { handleDelete(todo) }}>
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
      {/* <!--Modal --> */}
      <div class="modal fade" id="exampleModal" >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Edit Todo</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1"><EditNoteIcon /></span>
                <input type="text" class="form-control" name='title' placeholder="Title" value={editTodo.title} aria-label="Title" aria-describedby="basic-addon1" onChange={handleChange} />
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1"><EditNoteIcon /></span>
                <input type="text" class="form-control" name='location' placeholder="Location" value={editTodo.location} aria-label="Location" aria-describedby="basic-addon1" onChange={handleChange} />
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1"><EditNoteIcon /></span>
                <input type="text" class="form-control" name='description' placeholder="Description" value={editTodo.description} aria-label="Description" aria-describedby="basic-addon1" onChange={handleChange} />
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1"><EditNoteIcon /></span>
                <input type="date" class="form-control" name='date' aria-label="date" value={editTodo.date} aria-describedby="basic-addon1" onChange={handleChange} />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={handleUpdate}>
                {
                  !isProcessingUpdate ? 'Update Todo'
                    : <div className="spinner-border spinner-border-sm"></div>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
