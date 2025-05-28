import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <>
      {/* Your routes/components */}
      <AppRouter />
      <ToastContainer />
    </>
  );
}

export default App;
