import React, { useState, useEffect, useContext } from 'react'
import { StarFilled } from '@ant-design/icons';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { doc, deleteDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../../Config/firebase'
import dayjs from 'dayjs';
import { AuthContext } from '../../../context/AuthContext';
import './today.scss';

const initialState = { title: '', location: '', date: '', description: '' }

export default function Today() {
  // the are state which is used for store data  of todo which is get from firestore
  const [documents, setDocuments] = useState([])
  // the are state which is used for store data  of todo which is get from input field of modal
  const [editTodo, setEditTodo] = useState(initialState)
  // the are state which is used for loading unloading
  const [isProcessingDelete, setIsProcessingDelete] = useState(false)
  const [isProcessingUpdate, setIsProcessingUpdate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // Get user from the AuthContext by using useContext
  const { user } = useContext(AuthContext)
  // HandleChange to get data from the fields of Modal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditTodo(s => ({ ...s, [name]: value }))
  }
  // It is used for read todos from the firestore of firebase and create a blank array 
  //and push data in the empty array  and set array  in the useState of document
  const fetchDocuments = async () => {
    setIsLoading(true)
    // this current date is original world wide date which is match by firebase todo date
    // if they match we get the todo of today 
    let currentDate = dayjs().format(`YYYY-MM-DD`)
    let array = []
    const q = query(collection(db, "todos"), where("date", "==", currentDate));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(doc.id, " => ", doc.data());
      array.push(data)
    });
    setDocuments(array)
    setIsLoading(false)
  }
  // By useEffect hook  all files are get from firestore and display on the page ,every time when refresh the page
  useEffect(() => {
    fetchDocuments()
  }, [])
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
    const todo = { ...editTodo }
    todo.dateCreated = todo.dateCreated
    todo.dateModified = serverTimestamp()
    todo.modifiedBy = {
      email: user.email,
      uid: user.uid
    }
    setIsProcessingUpdate(true)
    try {
      await setDoc(doc(db, "todos", todo.id), todo, { merge: true });
      window.toastify('Todo is Updated Successfully', 'success')
      // This is used by replace old todo by updated todo with refreshing the page
      //logic start
      let newDocuments = documents.map((doc) => {
        if (doc.id === todo.id)
          return todo
        return doc
      })
      setDocuments(newDocuments)
      // logic end

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
                <span className='text-white  fw-bold ms-2 fs-2'>Today</span>
              </div>
            </div>
          </div>
          {documents.map((todo, i) => {
            return <div className="row py-3 px-3 mb-3 rounded d-flex align-items-center" key={i} style={{ backgroundColor: '#393939', color: '#757575' }}>
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
              <div className="col-lg-3 d-flex align-items-center  "  >
                {todo.status === 'active' && <div className="green-checkbox" />}
                <h6 className={`text-${todo.status === 'active' ? 'info' : 'white'} align-items-center  `}>{todo.status}</h6>
                <button type="button" class="btn bg-transparent" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { setEditTodo(todo) }}  >
                  <EditNoteIcon className='text-white  fs-2 ms-4 ' />
                </button>
                <button className='bg-transparent border-0' onClick={() => { handleDelete(todo) }}>
                  {!isProcessingDelete ?
                    <DeleteIcon className='text-white fs-3 ' />
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
                <input type="text" class="form-control " placeholder="Title" aria-label="title" value={editTodo.title} name='title' aria-describedby="basic-addon1" onChange={handleChange} />
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text bg-transparent" id="basic-addon1"><EditNoteIcon /></span>
                <input type="text" class="form-control " placeholder="Location" aria-label="Location" value={editTodo.location} name='location' aria-describedby="basic-addon1" onChange={handleChange} />
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text bg-transparent" id="basic-addon1"><EditNoteIcon /></span>
                <input type="text" class="form-control " placeholder="Description" aria-label="description" value={editTodo.description} name='description' aria-describedby="basic-addon1" onChange={handleChange} />
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text bg-transparent" id="basic-addon1"><EditNoteIcon /></span>
                <input type="date" class="form-control " aria-label="date" name='date' value={editTodo.date} aria-describedby="basic-addon1" onChange={handleChange} />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={handleUpdate}>
                {
                  !isProcessingUpdate ?
                    'Update Todo'
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
