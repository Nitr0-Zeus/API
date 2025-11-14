import React, { useState, useEffect } from 'react';
import { Tarefa } from '../types/Tarefa';
import { tarefaService } from '../services/tarefaService';
import './TarefaList.css';

export const TarefaList: React.FC = () => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [filtro, setFiltro] = useState<'todas' | 'nao-concluidas' | 'concluidas'>('todas');
  const [titulo, setTitulo] = useState('');
  const [loading, setLoading] = useState(false);

  const carregarTarefas = async () => {
    setLoading(true);
    try {
      let dados: Tarefa[] = [];
      if (filtro === 'todas') {
        dados = await tarefaService.listarTodas();
      } else if (filtro === 'nao-concluidas') {
        dados = await tarefaService.listarNaoConcluidas();
      } else {
        dados = await tarefaService.listarConcluidas();
      }
      setTarefas(dados);
    } catch (error) {
      console.error(error);
      setTarefas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTarefas();
  }, [filtro]);

  const handleCadastrar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    try {
      await tarefaService.cadastrar(titulo);
      setTitulo('');
      carregarTarefas();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAlterarStatus = async (tarefaId: string) => {
    try {
      await tarefaService.alterarStatus(tarefaId);
      carregarTarefas();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Não iniciada':
        return '#999';
      case 'Em andamento':
        return '#ff9800';
      case 'Concluída':
        return '#4caf50';
      default:
        return '#999';
    }
  };

  const getButtonText = (status: string): string => {
    if (status === 'Não iniciada') return 'Iniciar';
    if (status === 'Em andamento') return 'Concluir';
    return 'Concluída';
  };

  const isButtonDisabled = (status: string): boolean => {
    return status === 'Concluída';
  };

  return (
    <div className="container">
      <h1>Gerenciador de Tarefas</h1>

      <form onSubmit={handleCadastrar} className="form-cadastro">
        <input
          type="text"
          placeholder="Digite uma nova tarefa..."
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="input-tarefa"
        />
        <button type="submit" className="btn-cadastrar">
          Adicionar Tarefa
        </button>
      </form>

      <div className="filtros">
        <button
          className={filtro === 'todas' ? 'btn-filtro ativo' : 'btn-filtro'}
          onClick={() => setFiltro('todas')}
        >
          Todas as Tarefas
        </button>
        <button
          className={filtro === 'nao-concluidas' ? 'btn-filtro ativo' : 'btn-filtro'}
          onClick={() => setFiltro('nao-concluidas')}
        >
          Não Concluídas
        </button>
        <button
          className={filtro === 'concluidas' ? 'btn-filtro ativo' : 'btn-filtro'}
          onClick={() => setFiltro('concluidas')}
        >
          Concluídas
        </button>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : tarefas.length === 0 ? (
        <p className="mensagem-vazia">Nenhuma tarefa encontrada</p>
      ) : (
        <div className="lista-tarefas">
          {tarefas.map((tarefa) => (
            <div key={tarefa.tarefaId} className="item-tarefa">
              <div className="info-tarefa">
                <div
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(tarefa.status) }}
                >
                  {tarefa.status}
                </div>
                <div className="detalhes">
                  <p className="titulo">{tarefa.titulo || 'Sem título'}</p>
                  <p className="data">
                    {new Date(tarefa.criadoEm).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <button
                className="btn-acao"
                onClick={() => handleAlterarStatus(tarefa.tarefaId)}
                disabled={isButtonDisabled(tarefa.status)}
              >
                {getButtonText(tarefa.status)}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
