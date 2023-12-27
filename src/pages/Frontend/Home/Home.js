import React, { useContext, useState } from 'react'
import './home.scss'
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from '../../../Config/firebase'
import { AuthContext } from '../../../context/AuthContext';


//inital state of the input field which is empty
const initialState = {
  title: '',
  location: '',
  date: '',
  description: ''
}
export default function Home() {

  // Get user from the AuthContext by using useContext
  const { user } = useContext(AuthContext)
  // the are state which is used for store data 
  const [state, setState] = useState(initialState)
  // the are state which is used for loading unloading
  const [isLoading, setIsLoading] = useState(false)


  // handlechange is used for getting data from the inputField
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState(s => ({ ...s, [name]: value }))
  }

  //handleSubmit funtion is used for adding a single todo in the collection of todos in firestore
  const handleSubmit = (e) => {
    e.preventDefault();
    let { title, location, date, description } = state;
    title = title.trim()
    location = location.trim()
    description = description.trim()
    if (title.length < 3) {
      window.toastify('The length should be atleast 3 characters.','warning')
    }
    if (location.length < 3) {
      window.toastify('The length should be atleast 3 characters.','warning')
    }
    if (description.length < 10) {
      window.toastify('The length should be atleast 10 characters.','warning')
    }
    //In the new todo variable another important hidden data is added in firestore 
    //with todo data(title,location,description,date) 

    let todo = { title, location, description, date }
    todo.dateCreated = serverTimestamp()
    todo.id = window.getRandomId()
    todo.status = 'active'
    todo.createdBy = {
      email: user.email,
      uid: user.uid
    }
    createDocument(todo)
  }
  //create document function is used for set single todo document in the firestore
  // and this function is taking outside the main function and call in handleSubmit function.
  // by passing todo as parameter.
  const createDocument = async (todo) => {
    setIsLoading(true)
    try {
      // 1st args database, 2nd args collection,3rd args data.id ,4th args data
      await setDoc(doc(db, "todos", todo.id), todo);
      window.toastify('Todo is created', 'success')
    } catch (err) {
      console.log(err)
      window.toastify('something gone error', 'error')
    }
    setIsLoading(false)
  }
  return (
    <div className="home bg-secondary" >
      <div className="container ">
        <div className="row">
          <div className="col">
            <h1 className='text-center text-white'>TodoList</h1>
          </div>
        </div>
        <form onSubmit={handleSubmit} >
          <div className="card p-3 p-md-4 mx-auto bg-warning" style={{ maxWidth: 400, }}>
            <div className="row mb-4">
              <div className="col">
                <input type="text" placeholder='Title' className='w-100 input-field' name='title' onChange={handleChange} />
              </div>
            </div>
            <div className="row mb-4">
              <div className="col">
                <input type="text" placeholder='Location' className='w-100 input-field' name='location' onChange={handleChange} />
              </div>
            </div>
            <div className="row mb-4">
              <div className="col">
                <input type="date" placeholder='Date' className='w-100 text-white input-field' name='date' onChange={handleChange} />
              </div>
            </div>
            <div className="row mb-4">
              <div className="col">
                <textarea name="description" placeholder='Description' id="description" cols="30" rows="5" className='w-100 text-white' onChange={handleChange}></textarea>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <button className='btn btn-secondary w-100' >{
                  !isLoading ? 'Add Todo' : <div className="spinner-border spinner-border-sm"></div>
                }</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
