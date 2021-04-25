import Layout from './containers/Layout/Layout';
import { BrowserRouter } from 'react-router-dom';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Layout/>
    </BrowserRouter>
  );
}

export default App;
