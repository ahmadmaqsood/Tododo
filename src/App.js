import './App.scss';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import Routes from './pages/Routes'
import AuthContextProvider from './context/AuthContext';
// React Toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
function App() {
  return (
    <AuthContextProvider>
      <Routes />
      <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
     </AuthContextProvider>
  );
}

export default App;
