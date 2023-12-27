import React, { useState, useEffect, useContext } from 'react'
import { StarFilled } from '@ant-design/icons';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { doc, deleteDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../Config/firebase'
import { AuthContext } from '../../../context/AuthContext';
import dayjs from 'dayjs';
import './up.scss'

const initialState = { title: '', location: '', date: '', description: '' }

export default function Upcoming() {
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessingDelete, setIsProcessingDelete] = useState(false)
  const [isProcessingUpdate, setIsProcessingUpdate] = useState(false)
  const [files, setFiles] = useState([])
  const [editTodo, setEditTodo] = useState(initialState)

  const { user } = useContext(AuthContext)

  //HandleChange to get data from the field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditTodo(s => ({ ...s, [name]: value }))
  }
  // To Get Data From Firestore in the Firebase

  const fetchDocuments = async () => {
    let currentDate = dayjs().format(`YYYY-MM-DD`)
    console.log(currentDate)

    let array = []
    const q = query(collection(db, "todos"), where("date", ">", currentDate));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(doc.id, " => ", doc.data());
      array.push(data)
    });
    setFiles(array)
  }
  // By useEffect hook  all files are get from firestore and display on the page ,every time when refresh the page
  useEffect(() => {
    fetchDocuments()
  }, [])

  // To Delete a Todo from the Todo List

  const handleDelete = async (todo) => {
    setIsProcessingDelete(true)
    try {
      await deleteDoc(doc(db, "todos", todo.id));
      let newFiles = files.filter((doc) => {
        return doc.id !== todo.id
      })
      setFiles(newFiles)
      window.toastify('Todo is Deleted', 'Success')
    }
    catch (err) {
      console.error(err)
      window.toastify('Something error while deleting', 'error')
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

      let newDocuments = files.map((doc) => {
        if (doc.id === todas.id)
          return todas
        return doc
      })
      setFiles(newDocuments)

    }
    catch (err) {
      console.error(err)
      window.toastify('Something is error', 'error')
    }
    setIsProcessingUpdate(false)
  }




  return (
    <>

      <div className="anytime" style={{ padding: 24, minHeight: '90vh', background: '#252525', }}>
        <div className="container">
          <div className="row mb-3">
            <div className="col">
              <div className="heading d-flex  align-items-center ">
                <StarFilled className='fs-2' style={{ color: 'yellow' }} />
                <span className='text-white  fw-bold ms-2 fs-2'>Upcoming</span>
              </div>
            </div>
          </div>
          {files.map((todo, i) => {
            return <div className="row py-2 px-3 mb-3 rounded d-flex align-items-center" key={i} style={{ backgroundColor: '#393939', color: '#757575' }}>
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
                <button type="button" class="btn bg-transparent" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { setEditTodo(todo) }} >
                  <EditNoteIcon className='text-white ms-4 fs-2 ' />
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
      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-3" id="exampleModalLabel">Edit Todo</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="input-group mb-3">
                <span class="input-group-text bg-transparent" id="basic-addon1"><EditNoteIcon /></span>
                <input type="text" class="form-control " placeholder="Title" aria-label="title" name='title' value={editTodo.title} aria-describedby="basic-addon1" onChange={handleChange} />
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text bg-transparent" id="basic-addon1"><EditNoteIcon /></span>
                <input type="text" class="form-control " placeholder="Location" aria-label="Location" name='location' value={editTodo.location} aria-describedby="basic-addon1" onChange={handleChange} />
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text bg-transparent" id="basic-addon1"><EditNoteIcon /></span>
                <input type="text" class="form-control " placeholder="Description" aria-label="description" name='description' value={editTodo.description} aria-describedby="basic-addon1" onChange={handleChange} />
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text bg-transparent" id="basic-addon1"><EditNoteIcon /></span>
                <input type="date" class="form-control " onChange={handleChange} aria-label="date" name='date' value={editTodo.date} aria-describedby="basic-addon1" />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={handleUpdate} >
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
