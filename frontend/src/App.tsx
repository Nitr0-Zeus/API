import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { TarefaList } from './components/TarefaList';
import { Listar } from './pages/tarefa/Listar';
import { Cadastrar } from './pages/tarefa/Cadastrar';
import { Alterar } from './pages/tarefa/Alterar';
import { Concluidas } from './pages/tarefa/Concluidas';
import { NaoConcluidas } from './pages/tarefa/NaoConcluidas';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
             Gerenciador de Tarefas
            </Link>
            <ul className="nav-menu">
              <li>
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/pages/tarefa/listar" className="nav-link">
                  Todas
                </Link>
              </li>
              <li>
                <Link to="/pages/tarefa/naoconcluidas" className="nav-link">
                  Não Concluídas
                </Link>
              </li>
              <li>
                <Link to="/pages/tarefa/concluidas" className="nav-link">
                  Concluídas
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<TarefaList />} />
          <Route path="/pages/tarefa/listar" element={<Listar />} />
          <Route path="/pages/tarefa/cadastrar" element={<Cadastrar />} />
          <Route path="/pages/tarefa/alterar/:id" element={<Alterar />} />
          <Route path="/pages/tarefa/naoconcluidas" element={<NaoConcluidas />} />
          <Route path="/pages/tarefa/concluidas" element={<Concluidas />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
