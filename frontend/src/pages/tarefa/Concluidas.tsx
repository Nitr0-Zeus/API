import React, { useState, useEffect } from 'react';
import { Tarefa } from '../../types/Tarefa';
import { tarefaService } from '../../services/tarefaService';
import './Concluidas.css';

export const Concluidas: React.FC = () => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarTarefas();
  }, []);

  const carregarTarefas = async () => {
    setLoading(true);
    try {
      const dados = await tarefaService.listarConcluidas();
      setTarefas(dados);
    } catch (error) {
      console.error('Erro ao carregar tarefas concluídas:', error);
      setTarefas([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-concluidas">
      <h1>Tarefas Concluídas</h1>

      {loading ? (
        <p className="carregando">Carregando tarefas...</p>
      ) : tarefas.length === 0 ? (
        <p className="mensagem-vazia">Nenhuma tarefa concluída encontrada</p>
      ) : (
        <div className="tabela-container">
          <table className="tabela-tarefas">
            <thead>
              <tr>
                <th>Título</th>
                <th>Data de Criação</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tarefas.map((tarefa) => (
                <tr key={tarefa.tarefaId}>
                  <td>{tarefa.titulo || 'Sem título'}</td>
                  <td>
                    {new Date(tarefa.criadoEm).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td>
                    <span className="status-badge status-concluida">
                      {tarefa.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
