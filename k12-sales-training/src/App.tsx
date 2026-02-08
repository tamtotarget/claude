import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ModulePage from './pages/ModulePage';
import QuizPage from './pages/QuizPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/module/:id" element={<ModulePage />} />
          <Route path="/quiz/:id" element={<QuizPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
