import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { tarefaService } from '../../services/tarefaService';
import './Cadastrar.css';

export function Cadastrar() {
  const navigate = useNavigate();
  const [titulo, setTitulo] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  async function handleCadastrar(e: React.FormEvent) {
    e.preventDefault();
    
    if (!titulo.trim()) {
      setErro('Por favor, insira um título para a tarefa');
      return;
    }

    try {
      setLoading(true);
      setErro('');

      await tarefaService.cadastrar(titulo.trim());
      
      // Limpar formulário
      setTitulo('');
      
      // Redirecionar para listagem
      setTimeout(() => {
        navigate('/pages/tarefa/listar');
      }, 500);
    } catch (error) {
      console.error('Erro ao cadastrar tarefa:', error);
      setErro('Erro ao cadastrar tarefa. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="cadastrar-container">
      <div className="cadastrar-card">
        <h1>Criar Nova Tarefa</h1>
        <p className="cadastrar-descricao">
          Adicione uma nova tarefa à sua lista. O status inicial será "Não iniciada".
        </p>

        {erro && <div className="cadastrar-erro">{erro}</div>}

        <form onSubmit={handleCadastrar} className="cadastrar-form">
          <div className="form-group">
            <label htmlFor="titulo">Título da Tarefa</label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Digite o título da tarefa..."
              disabled={loading}
              className="form-input"
              maxLength={100}
            />
            <span className="char-count">{titulo.length}/100</span>
          </div>

          <div className="form-info">
            <h3>Status Inicial</h3>
            <div className="status-info">
              <span className="status-badge não-iniciada">
                Não iniciada
              </span>
              <p>Todas as novas tarefas começam com este status.</p>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              disabled={loading || !titulo.trim()}
              className="btn-submit"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar Tarefa'}
            </button>
            <Link to="/pages/tarefa/listar" className="btn-cancelar">
              Cancelar
            </Link>
          </div>
        </form>

        <div className="cadastrar-dicas">
          <h3>Dicas:</h3>
          <ul>
            <li>Use títulos claros e descritivos</li>
            <li>Você poderá editar o status da tarefa depois</li>
            <li>As tarefas são salvas automaticamente</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
