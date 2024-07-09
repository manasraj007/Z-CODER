// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route , useLocation} from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import QuestionPage from './pages/QuestionsPage';
import ContestsPage from './pages/ContestsPage';
import RoomsPage from './pages/RoomsPage';
import CodeEditorPage from './pages/CodeEditor';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <div className="app">
        <ConditionalHeaderFooter />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LoginPage />} /> 
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/Questions" element={<QuestionPage />} />
            <Route path="/contests" element={<ContestsPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/code-editor" element={<CodeEditorPage />} />
          </Routes>
        </main>
        <ConditionalHeaderFooter />
      </div>
    </Router>
  );
}
function ConditionalHeaderFooter() {
  const location = useLocation();
  const noHeaderFooterPaths = ['/'];
  if(noHeaderFooterPaths.includes(location.pathname)){
    return null;
  }

  return (
    <>
      <Header/>
      <Footer/>
    </>
  );
}

export default App;
