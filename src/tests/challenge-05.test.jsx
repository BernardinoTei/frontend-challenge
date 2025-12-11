import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AdminDashboard, RecentActivities, PendingApprovals, UserStats, MainPanel } from '../challenges/debug-challenge-05-unmount';

describe('Desafio 5: Bugs de Renderização Condicional / Desmontagem', () => {
  
  let consoleErrorSpy;
  let consoleWarnSpy;

  beforeEach(() => {
    // Espiar console.error para capturar avisos do React
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  // ============================================================================
  // TESTE 1: Tab Inicial Deve Exibir Atividades
  // ============================================================================
  it('deve exibir o separador de atividades por padrão', async () => {
    render(<AdminDashboard />);
    
    expect(screen.getByTestId('tab-activities')).toHaveClass('active');
    expect(screen.getByTestId('activities-loading')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByTestId('recent-activities')).toBeInTheDocument();
    }, { timeout: 300 });
  });

  // ============================================================================
  // TESTE 2: Deve Alternar Entre Separadores com Sucesso
  // ============================================================================
  it('deve alternar entre separadores', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('recent-activities')).toBeInTheDocument();
    }, { timeout: 300 });
    
    // Alternar para o separador de aprovações
    fireEvent.click(screen.getByTestId('tab-approvals'));
    
    expect(screen.getByTestId('approvals-loading')).toBeInTheDocument();
    expect(screen.queryByTestId('recent-activities')).not.toBeInTheDocument();
  });

  // ============================================================================
  // TESTE 3: Não Deve Causar Fuga de Memória ao Alternar Separadores Rapidamente
  // ============================================================================
  it('não deve causar fuga de memória ou avisos ao alternar separadores antes do carregamento terminar', async () => {
    render(<AdminDashboard />);
    
    // Iniciar carregamento de atividades
    expect(screen.getByTestId('activities-loading')).toBeInTheDocument();
    
    // Alternar rapidamente para aprovações antes das atividades terminarem de carregar (200ms)
    await new Promise(resolve => setTimeout(resolve, 50));
    fireEvent.click(screen.getByTestId('tab-approvals'));
    
    // Aguardar que o fetch original de atividades seja concluído (deve ser cancelado ou ignorado)
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Não deve haver avisos do React sobre definir estado em componente desmontado
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("Can't perform a React state update on an unmounted component")
    );
    expect(consoleWarnSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("Can't perform a React state update on an unmounted component")
    );
  });

  // ============================================================================
  // TESTE 4: Alternância Rápida de Separadores Não Deve Causar Erros
  // ============================================================================
  it('deve tratar alternância rápida de separadores sem erros', async () => {
    render(<AdminDashboard />);
    
    // Alternar rapidamente entre separadores
    fireEvent.click(screen.getByTestId('tab-approvals'));
    await new Promise(resolve => setTimeout(resolve, 20));
    
    fireEvent.click(screen.getByTestId('tab-stats'));
    await new Promise(resolve => setTimeout(resolve, 20));
    
    fireEvent.click(screen.getByTestId('tab-activities'));
    await new Promise(resolve => setTimeout(resolve, 20));
    
    fireEvent.click(screen.getByTestId('tab-approvals'));
    
    // Aguardar que todas as operações assíncronas sejam concluídas
    await waitFor(() => {
      expect(screen.getByTestId('pending-approvals')).toBeInTheDocument();
    }, { timeout: 500 });
    
    // Sem erros de consola sobre componentes desmontados
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("Can't perform a React state update")
    );
  });

  // ============================================================================
  // TESTE 5: Deve Exibir Conteúdo Após Alternância de Separador Concluir
  // ============================================================================
  it('deve exibir conteúdo correto após alternância de separador concluir', async () => {
    render(<AdminDashboard />);
    
    // Aguardar que as atividades carreguem
    await waitFor(() => {
      expect(screen.getByTestId('recent-activities')).toBeInTheDocument();
    }, { timeout: 300 });
    
    expect(screen.getByTestId('activities-count')).toHaveTextContent('Total: 5');
    
    // Alternar para aprovações
    fireEvent.click(screen.getByTestId('tab-approvals'));
    
    await waitFor(() => {
      expect(screen.getByTestId('pending-approvals')).toBeInTheDocument();
    }, { timeout: 300 });
    
    expect(screen.getByTestId('approvals-count')).toHaveTextContent('Total: 3');
  });

  // ============================================================================
  // TESTE 6: Não Deve Mostrar Conteúdo Antigo ao Voltar
  // ============================================================================
  it('não deve mostrar conteúdo obsoleto ao voltar ao separador anterior', async () => {
    render(<AdminDashboard />);
    
    // Carregar atividades
    await waitFor(() => {
      expect(screen.getByTestId('recent-activities')).toBeInTheDocument();
    }, { timeout: 300 });
    
    const originalActivitiesCount = screen.getByTestId('activities-count').textContent;
    
    // Alternar e voltar
    fireEvent.click(screen.getByTestId('tab-approvals'));
    
    await waitFor(() => {
      expect(screen.getByTestId('pending-approvals')).toBeInTheDocument();
    }, { timeout: 300 });
    
    fireEvent.click(screen.getByTestId('tab-activities'));
    
    await waitFor(() => {
      expect(screen.getByTestId('recent-activities')).toBeInTheDocument();
    }, { timeout: 300 });
    
    // Deve mostrar o mesmo conteúdo (re-obtido)
    expect(screen.getByTestId('activities-count')).toHaveTextContent(originalActivitiesCount);
  });

  // ============================================================================
  // TESTE 7: Deve Limpar Operações Assíncronas ao Desmontar
  // ============================================================================
  it('deve limpar adequadamente operações assíncronas quando o componente é desmontado', async () => {
    const { unmount } = render(<RecentActivities />);
    
    // Desmontar antes do fetch terminar
    await new Promise(resolve => setTimeout(resolve, 50));
    unmount();
    
    // Aguardar que o fetch seja concluído
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Não deve haver avisos sobre atualizações de estado em componente desmontado
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("Can't perform a React state update")
    );
  });

  // ============================================================================
  // TESTE 8: Múltiplos Componentes Devem Tratar Desmontagem Adequadamente
  // ============================================================================
  it('deve tratar desmontagem adequadamente para todos os componentes de separador', async () => {
    render(<AdminDashboard />);
    
    // Começar com atividades
    expect(screen.getByTestId('activities-loading')).toBeInTheDocument();
    
    // Alternar para aprovações antes das atividades carregarem
    await new Promise(resolve => setTimeout(resolve, 50));
    fireEvent.click(screen.getByTestId('tab-approvals'));
    
    // Alternar para estatísticas antes das aprovações carregarem
    await new Promise(resolve => setTimeout(resolve, 50));
    fireEvent.click(screen.getByTestId('tab-stats'));
    
    // Aguardar que todas as operações assíncronas sejam concluídas
    await waitFor(() => {
      expect(screen.getByTestId('user-stats')).toBeInTheDocument();
    }, { timeout: 500 });
    
    // Sem erros de consola
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("Can't perform a React state update")
    );
  });

  // ============================================================================
  // TESTE 9: Deve Mostrar Estado de Carregamento ao Alternar Separadores
  // ============================================================================
  it('deve mostrar estado de carregamento imediatamente ao alternar separadores', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('recent-activities')).toBeInTheDocument();
    }, { timeout: 300 });
    
    // Alternar para aprovações
    fireEvent.click(screen.getByTestId('tab-approvals'));
    
    // Deve mostrar imediatamente o estado de carregamento
    expect(screen.getByTestId('approvals-loading')).toBeInTheDocument();
    expect(screen.queryByTestId('recent-activities')).not.toBeInTheDocument();
  });

  // ============================================================================
  // TESTE 10: Navegação por Separadores Deve Atualizar Estado Ativo
  // ============================================================================
  it('deve atualizar a classe do separador ativo corretamente', async () => {
    render(<AdminDashboard />);
    
    expect(screen.getByTestId('tab-activities')).toHaveClass('active');
    expect(screen.getByTestId('tab-approvals')).not.toHaveClass('active');
    expect(screen.getByTestId('tab-stats')).not.toHaveClass('active');
    
    fireEvent.click(screen.getByTestId('tab-approvals'));
    
    expect(screen.getByTestId('tab-activities')).not.toHaveClass('active');
    expect(screen.getByTestId('tab-approvals')).toHaveClass('active');
    expect(screen.getByTestId('tab-stats')).not.toHaveClass('active');
  });

  // ============================================================================
  // TESTE 11: Deve Tratar Remontagem de Componente
  // ============================================================================
  it('deve tratar remontagem de componente sem problemas', async () => {
    render(<AdminDashboard />);
    
    // Carregar atividades
    await waitFor(() => {
      expect(screen.getByTestId('recent-activities')).toBeInTheDocument();
    }, { timeout: 300 });
    
    // Alternar
    fireEvent.click(screen.getByTestId('tab-approvals'));
    
    await waitFor(() => {
      expect(screen.getByTestId('pending-approvals')).toBeInTheDocument();
    }, { timeout: 300 });
    
    // Voltar (remontar RecentActivities)
    fireEvent.click(screen.getByTestId('tab-activities'));
    
    // Deve mostrar carregamento novamente
    expect(screen.getByTestId('activities-loading')).toBeInTheDocument();
    
    // Deve carregar com sucesso
    await waitFor(() => {
      expect(screen.getByTestId('recent-activities')).toBeInTheDocument();
    }, { timeout: 300 });
    
    expect(screen.getByTestId('activities-count')).toHaveTextContent('Total: 5');
  });

  // ============================================================================
  // TESTE 12: Alternância Durante Carregamento Deve Cancelar Operação Anterior
  // ============================================================================
  it('deve cancelar ou ignorar operação anterior ao alternar durante carregamento', async () => {
    render(<AdminDashboard />);
    
    // Iniciar carregamento de atividades (demora 200ms)
    expect(screen.getByTestId('activities-loading')).toBeInTheDocument();
    
    // Alternar após 100ms (antes das atividades terminarem)
    await new Promise(resolve => setTimeout(resolve, 100));
    fireEvent.click(screen.getByTestId('tab-approvals'));
    
    // Agora a carregar aprovações
    expect(screen.getByTestId('approvals-loading')).toBeInTheDocument();
    
    // Aguardar que ambos os fetches sejam concluídos
    await waitFor(() => {
      expect(screen.getByTestId('pending-approvals')).toBeInTheDocument();
    }, { timeout: 400 });
    
    // Deve mostrar aprovações, não atividades
    expect(screen.getByTestId('pending-approvals')).toBeInTheDocument();
    expect(screen.queryByTestId('recent-activities')).not.toBeInTheDocument();
    
    // Sem avisos de atualização de estado
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.stringContaining("Can't perform a React state update")
    );
  });

  // ============================================================================
  // TESTE 13: Todos os Três Separadores Devem Carregar os Seus Dados Corretamente
  // ============================================================================
  it('deve carregar dados corretamente para todos os três separadores', async () => {
    render(<AdminDashboard />);
    
    // Testar separador de atividades
    await waitFor(() => {
      expect(screen.getByTestId('recent-activities')).toBeInTheDocument();
    }, { timeout: 300 });
    expect(screen.getByTestId('activity-1')).toBeInTheDocument();
    
    // Testar separador de aprovações
    fireEvent.click(screen.getByTestId('tab-approvals'));
    await waitFor(() => {
      expect(screen.getByTestId('pending-approvals')).toBeInTheDocument();
    }, { timeout: 300 });
    expect(screen.getByTestId('approval-1')).toBeInTheDocument();
    
    // Testar separador de estatísticas
    fireEvent.click(screen.getByTestId('tab-stats'));
    await waitFor(() => {
      expect(screen.getByTestId('user-stats')).toBeInTheDocument();
    }, { timeout: 300 });
    expect(screen.getByTestId('total-users')).toHaveTextContent('Total Users: 1250');
  });
});
