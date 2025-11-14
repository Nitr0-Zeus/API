import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tarefaService } from '../../services/tarefaService';
import { Tarefa } from '../../types/Tarefa';
import './Listar.css';

export function Listar() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarTarefas();
  }, []);

  async function carregarTarefas() {
    try {
      setLoading(true);
      const dados = await tarefaService.listarTodas();
      setTarefas(dados);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="listar-container"><p>Carregando tarefas...</p></div>;
  }

  return (
    <div className="listar-container">
      <div className="listar-header">
        <h1>Todas as Tarefas</h1>
        <Link to="/pages/tarefa/cadastrar" className="btn-criar">
          + Nova Tarefa
        </Link>
      </div>

      {tarefas.length === 0 ? (
        <div className="listar-vazio">
          <p>Nenhuma tarefa encontrada</p>
          <Link to="/pages/tarefa/cadastrar" className="btn-link">
            Criar primeira tarefa
          </Link>
        </div>
      ) : (
        <table className="listar-tabela">
          <thead>
            <tr>
              <th>Título</th>
              <th>Status</th>
              <th>Criada em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {tarefas.map((tarefa) => (
              <tr key={tarefa.tarefaId}>
                <td>{tarefa.titulo}</td>
                <td>
                  <span className={`status ${tarefa.status.toLowerCase().replace(' ', '-')}`}>
                    {tarefa.status}
                  </span>
                </td>
                <td>{new Date(tarefa.criadoEm).toLocaleDateString('pt-BR')}</td>
                <td>
                  <Link to={`/pages/tarefa/alterar/${tarefa.tarefaId}`} className="btn-editar">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
