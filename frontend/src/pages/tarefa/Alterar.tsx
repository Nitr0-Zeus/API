import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tarefaService } from '../../services/tarefaService';
import { Tarefa } from '../../types/Tarefa';
import './Alterar.css';

export function Alterar() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tarefa, setTarefa] = useState<Tarefa | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarTarefa();
  }, [id]);

  async function carregarTarefa() {
    try {
      setLoading(true);
      const todas = await tarefaService.listarTodas();
      const encontrada = todas.find(t => t.tarefaId === id);
      
      if (encontrada) {
        setTarefa(encontrada);
      } else {
        setErro('Tarefa não encontrada');
      }
    } catch (error) {
      console.error('Erro ao carregar tarefa:', error);
      setErro('Erro ao carregar a tarefa');
    } finally {
      setLoading(false);
    }
  }

  async function handleAlterarStatus() {
    if (!tarefa || !id) return;

    try {
      setSalvando(true);
      setErro('');
      
      await tarefaService.alterarStatus(id);
      
      // Atualizar tarefa local para refletir a mudança
      let novoStatus = tarefa.status;
      if (tarefa.status === 'Não iniciada') {
        novoStatus = 'Em andamento';
      } else if (tarefa.status === 'Em andamento') {
        novoStatus = 'Concluída';
      }
      
      setTarefa({
        ...tarefa,
        status: novoStatus
      });

      // Redirecionar após sucesso
      setTimeout(() => {
        navigate('/pages/tarefa/listar');
      }, 1000);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      setErro('Erro ao alterar o status da tarefa');
    } finally {
      setSalvando(false);
    }
  }

  function getPróximoStatus() {
    if (!tarefa) return '';
    if (tarefa.status === 'Não iniciada') return 'Em andamento';
    if (tarefa.status === 'Em andamento') return 'Concluída';
    return 'Nenhuma alteração possível (tarefa concluída)';
  }

  function podeAlterarStatus() {
    return tarefa && tarefa.status !== 'Concluída';
  }

  if (loading) {
    return (
      <div className="alterar-container">
        <div className="alterar-card">
          <p>Carregando tarefa...</p>
        </div>
      </div>
    );
  }

  if (erro && !tarefa) {
    return (
      <div className="alterar-container">
        <div className="alterar-card">
          <div className="alterar-erro-full">{erro}</div>
          <Link to="/pages/tarefa/listar" className="btn-voltar">
            Voltar para listagem
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="alterar-container">
      <div className="alterar-card">
        <h1>Alterar Status da Tarefa</h1>

        {erro && <div className="alterar-erro">{erro}</div>}

        {tarefa && (
          <div className="alterar-conteudo">
            <div className="tarefa-info">
              <h2>{tarefa.titulo}</h2>
              <p className="tarefa-data">
                Criada em: {new Date(tarefa.criadoEm).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className="status-atual">
              <h3>Status Atual</h3>
              <span className={`status-grande ${tarefa.status.toLowerCase().replace(' ', '-')}`}>
                {tarefa.status}
              </span>
            </div>

            <div className="status-transicao">
              <h3>Transição de Status</h3>
              <div className="transicao-fluxo">
                <div className="status-item">
                  <span className="status-passo">Atual</span>
                  <span className={`status-tag ${tarefa.status.toLowerCase().replace(' ', '-')}`}>
                    {tarefa.status}
                  </span>
                </div>

                <div className="seta">→</div>

                <div className="status-item">
                  <span className="status-passo">Próximo</span>
                  <span className={`status-tag ${getPróximoStatus().toLowerCase().replace(' ', '-')}`}>
                    {getPróximoStatus()}
                  </span>
                </div>
              </div>
            </div>

            <div className="status-legenda">
              <h3>Estados Disponíveis</h3>
              <div className="legenda-item">
                <span className="status-badge não-iniciada">Não iniciada</span>
                <p>Tarefa ainda não foi iniciada</p>
              </div>
              <div className="legenda-item">
                <span className="status-badge em-andamento">Em andamento</span>
                <p>Tarefa está em progresso</p>
              </div>
              <div className="legenda-item">
                <span className="status-badge concluída">Concluída</span>
                <p>Tarefa foi finalizada (estado terminal)</p>
              </div>
            </div>

            <div className="alterar-acoes">
              {podeAlterarStatus() ? (
                <>
                  <button
                    onClick={handleAlterarStatus}
                    disabled={salvando}
                    className="btn-avancar"
                  >
                    {salvando ? 'Alterando...' : `Avançar para: ${getPróximoStatus()}`}
                  </button>
                  <Link to="/pages/tarefa/listar" className="btn-cancelar-alt">
                    Cancelar
                  </Link>
                </>
              ) : (
                <>
                  <div className="tarefa-concluida-msg">
                    ✅ Tarefa já foi concluída. Não é possível alterar o status.
                  </div>
                  <Link to="/pages/tarefa/listar" className="btn-voltar-alt">
                    Voltar
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
