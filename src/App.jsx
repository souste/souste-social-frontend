import { Route, Routes } from 'react-router-dom';
import Posts from './components/Posts';
import SinglePost from './components/SinglePost';
import Header from './components/Header';
import './styles.css';

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Posts />} />
        <Route path="/posts/:postId" element={<SinglePost />} />
      </Routes>
    </div>
  );
}

export default App;
