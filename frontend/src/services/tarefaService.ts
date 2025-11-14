import { Tarefa } from '../types/Tarefa';

const API_BASE_URL = 'http://localhost:5273/api';

export const tarefaService = {
  async listarTodas(): Promise<Tarefa[]> {
    const response = await fetch(`${API_BASE_URL}/tarefas/listar`);
    if (!response.ok) {
      throw new Error('Erro ao listar tarefas');
    }
    return response.json();
  },

  async listarNaoConcluidas(): Promise<Tarefa[]> {
    const response = await fetch(`${API_BASE_URL}/tarefa/naoconcluidas`);
    if (!response.ok) {
      throw new Error('Erro ao listar tarefas não concluídas');
    }
    return response.json();
  },

  async listarConcluidas(): Promise<Tarefa[]> {
    const response = await fetch(`${API_BASE_URL}/tarefa/concluidas`);
    if (!response.ok) {
      throw new Error('Erro ao listar tarefas concluídas');
    }
    return response.json();
  },

  async cadastrar(titulo: string): Promise<Tarefa> {
    const response = await fetch(`${API_BASE_URL}/tarefas/cadastrar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ titulo }),
    });
    if (!response.ok) {
      throw new Error('Erro ao cadastrar tarefa');
    }
    return response.json();
  },

  async alterarStatus(tarefaId: string): Promise<Tarefa> {
    const response = await fetch(`${API_BASE_URL}/tarefas/alterar/${tarefaId}`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error('Erro ao alterar status da tarefa');
    }
    return response.json();
  },
};
