import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminDashboard, MainPanel } from '../challenges/debug-challenge-04-race-condition';

describe('Desafio 4: Condição de Corrida Entre Widgets', () => {
  
  // ============================================================================
  // TESTE 1: Carregamento Inicial Deve Definir Total de Utilizadores a partir de UserStats
  // ============================================================================
  it('deve definir total de utilizadores a partir de UserStats no carregamento inicial', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('user-stats')).toBeInTheDocument();
    }, { timeout: 200 });
    
    expect(screen.getByTestId('total-users')).toHaveTextContent('Total Users: 1250');
  });

  // ============================================================================
  // TESTE 2: Ambos os Componentes Devem Mostrar o Mesmo Total de Utilizadores Inicialmente
  // ============================================================================
  it('deve exibir o mesmo total de utilizadores em ambos os componentes após carregamento inicial', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('user-stats')).toBeInTheDocument();
      expect(screen.getByTestId('pending-approvals')).toBeInTheDocument();
    }, { timeout: 200 });
    
    const userStatsTotal = screen.getByTestId('total-users').textContent;
    const approvalsTotal = screen.getByTestId('approvals-total-users').textContent;
    
    expect(userStatsTotal).toContain('1250');
    expect(approvalsTotal).toContain('1250');
  });

  // ============================================================================
  // TESTE 3: Aprovar Utilizador Deve Incrementar Total de Utilizadores
  // ============================================================================
  it('deve incrementar o total de utilizadores ao aprovar um utilizador', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('pending-approvals')).toBeInTheDocument();
    }, { timeout: 200 });
    
    const approveBtn = screen.getByTestId('approve-btn-1');
    fireEvent.click(approveBtn);
    
    await waitFor(() => {
      expect(screen.getByTestId('total-users')).toHaveTextContent('Total Users: 1251');
    }, { timeout: 150 });
  });

  // ============================================================================
  // TESTE 4: Aprovações Rápidas Devem Atualizar Total de Utilizadores Corretamente
  // ============================================================================
  it('deve tratar aprovações rápidas sucessivas sem perder a contagem', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('pending-approvals')).toBeInTheDocument();
    }, { timeout: 200 });
    
    // Aprovar múltiplos utilizadores rapidamente
    fireEvent.click(screen.getByTestId('approve-btn-1'));
    
    // Aguardar primeira aprovação
    await waitFor(() => {
      expect(screen.queryByTestId('approval-1')).not.toBeInTheDocument();
    }, { timeout: 100 });
    
    fireEvent.click(screen.getByTestId('approve-btn-2'));
    
    // Aguardar segunda aprovação
    await waitFor(() => {
      expect(screen.queryByTestId('approval-2')).not.toBeInTheDocument();
    }, { timeout: 100 });
    
    // O total deve ser 1250 + 2 = 1252
    expect(screen.getByTestId('total-users')).toHaveTextContent('Total Users: 1252');
  });

  // ============================================================================
  // TESTE 5: Atualizações Concorrentes Não Devem Sobrescrever Umas às Outras
  // ============================================================================
  it('não deve perder atualizações quando ambos os componentes atualizam simultaneamente', async () => {
    render(<MainPanel />);
    
    // Aguardar que ambos os componentes carreguem
    await waitFor(() => {
      expect(screen.getByTestId('user-stats')).toBeInTheDocument();
      expect(screen.getByTestId('pending-approvals')).toBeInTheDocument();
    }, { timeout: 200 });
    
    // Verificar contagem de atualizações (deve ser 1 do carregamento inicial de UserStats)
    const updateCount = parseInt(screen.getByTestId('update-count').textContent);
    expect(updateCount).toBeGreaterThanOrEqual(1);
    
    // Aprovar um utilizador (isto irá desencadear outra atualização)
    fireEvent.click(screen.getByTestId('approve-btn-1'));
    
    await waitFor(() => {
      expect(screen.queryByTestId('approval-1')).not.toBeInTheDocument();
    }, { timeout: 100 });
    
    // A contagem de atualizações deve agora ser 2 (inicial + aprovação)
    const finalUpdateCount = parseInt(screen.getByTestId('update-count').textContent);
    expect(finalUpdateCount).toBe(2);
    
    // O total deve estar correto (1250 + 1 = 1251)
    expect(screen.getByTestId('total-users')).toHaveTextContent('Total Users: 1251');
  });

  // ============================================================================
  // TESTE 6: Múltiplas Aprovações Rápidas Devem Manter Contagem Precisa
  // ============================================================================
  it('deve manter contagem precisa com múltiplas aprovações rápidas', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('pending-approvals')).toBeInTheDocument();
    }, { timeout: 200 });
    
    // Clicar nos três botões de aprovação rapidamente
    fireEvent.click(screen.getByTestId('approve-btn-1'));
    fireEvent.click(screen.getByTestId('approve-btn-2'));
    fireEvent.click(screen.getByTestId('approve-btn-3'));
    
    // Aguardar que todas as aprovações sejam concluídas
    await waitFor(() => {
      expect(screen.queryByTestId('approval-1')).not.toBeInTheDocument();
      expect(screen.queryByTestId('approval-2')).not.toBeInTheDocument();
      expect(screen.queryByTestId('approval-3')).not.toBeInTheDocument();
    }, { timeout: 300 });
    
    // O total deve ser 1250 + 3 = 1253
    expect(screen.getByTestId('total-users')).toHaveTextContent('Total Users: 1253');
  });

  // ============================================================================
  // TESTE 7: Contagem de Aprovações Pendentes Deve Diminuir
  // ============================================================================
  it('deve diminuir a contagem de aprovações pendentes ao aprovar', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('pending-approvals')).toBeInTheDocument();
    }, { timeout: 200 });
    
    expect(screen.getByTestId('pending-approvals')).toHaveTextContent('Pending Approvals (3)');
    
    fireEvent.click(screen.getByTestId('approve-btn-1'));
    
    await waitFor(() => {
      expect(screen.getByTestId('pending-approvals')).toHaveTextContent('Pending Approvals (2)');
    }, { timeout: 150 });
  });

  // ============================================================================
  // TESTE 8: Itens Aprovados Devem Ser Removidos da Lista
  // ============================================================================
  it('deve remover itens aprovados da lista', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('pending-approvals')).toBeInTheDocument();
    }, { timeout: 200 });
    
    expect(screen.getByTestId('approval-1')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId('approve-btn-1'));
    
    await waitFor(() => {
      expect(screen.queryByTestId('approval-1')).not.toBeInTheDocument();
    }, { timeout: 150 });
    
    // Os outros itens ainda devem estar presentes
    expect(screen.getByTestId('approval-2')).toBeInTheDocument();
    expect(screen.getByTestId('approval-3')).toBeInTheDocument();
  });

  // ============================================================================
  // TESTE 9: Botão Deve Desativar Durante Aprovação
  // ============================================================================
  it('deve desativar o botão enquanto a aprovação está em progresso', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('pending-approvals')).toBeInTheDocument();
    }, { timeout: 200 });
    
    const approveBtn = screen.getByTestId('approve-btn-1');
    
    expect(approveBtn).not.toBeDisabled();
    
    fireEvent.click(approveBtn);
    
    expect(approveBtn).toBeDisabled();
    expect(approveBtn).toHaveTextContent('Approving...');
    
    await waitFor(() => {
      expect(screen.queryByTestId('approval-1')).not.toBeInTheDocument();
    }, { timeout: 150 });
  });

  // ============================================================================
  // TESTE 10: Ambos os Componentes Devem Carregar Independentemente
  // ============================================================================
  it('deve carregar ambos os componentes independentemente', async () => {
    render(<AdminDashboard />);
    
    // UserStats carrega em ~100ms
    await waitFor(() => {
      expect(screen.getByTestId('user-stats')).toBeInTheDocument();
    }, { timeout: 150 });
    
    // PendingApprovals carrega em ~80ms
    await waitFor(() => {
      expect(screen.getByTestId('pending-approvals')).toBeInTheDocument();
    }, { timeout: 150 });
  });

  // ============================================================================
  // TESTE 11: Estado Deve Permanecer Consistente Após Aprovações Sequenciais
  // ============================================================================
  it('deve manter estado consistente após aprovações sequenciais', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('pending-approvals')).toBeInTheDocument();
    }, { timeout: 200 });
    
    // Primeira aprovação
    fireEvent.click(screen.getByTestId('approve-btn-1'));
    
    await waitFor(() => {
      expect(screen.queryByTestId('approval-1')).not.toBeInTheDocument();
    }, { timeout: 150 });
    
    const countAfterFirst = screen.getByTestId('total-users').textContent;
    expect(countAfterFirst).toContain('1251');
    
    // Segunda aprovação
    fireEvent.click(screen.getByTestId('approve-btn-2'));
    
    await waitFor(() => {
      expect(screen.queryByTestId('approval-2')).not.toBeInTheDocument();
    }, { timeout: 150 });
    
    const countAfterSecond = screen.getByTestId('total-users').textContent;
    expect(countAfterSecond).toContain('1252');
  });

  // ============================================================================
  // TESTE 12: Contagem de Atualizações Deve Corresponder ao Número de Mudanças de Estado
  // ============================================================================
  it('deve rastrear o número correto de atualizações de estado', async () => {
    render(<MainPanel />);
    
    await waitFor(() => {
      expect(screen.getByTestId('user-stats')).toBeInTheDocument();
      expect(screen.getByTestId('pending-approvals')).toBeInTheDocument();
    }, { timeout: 200 });
    
    // Atualização inicial de UserStats
    let updateCount = parseInt(screen.getByTestId('update-count').textContent);
    expect(updateCount).toBe(1);
    
    // Aprovar primeiro utilizador
    fireEvent.click(screen.getByTestId('approve-btn-1'));
    
    await waitFor(() => {
      expect(screen.queryByTestId('approval-1')).not.toBeInTheDocument();
    }, { timeout: 150 });
    
    updateCount = parseInt(screen.getByTestId('update-count').textContent);
    expect(updateCount).toBe(2);
    
    // Aprovar segundo utilizador
    fireEvent.click(screen.getByTestId('approve-btn-2'));
    
    await waitFor(() => {
      expect(screen.queryByTestId('approval-2')).not.toBeInTheDocument();
    }, { timeout: 150 });
    
    updateCount = parseInt(screen.getByTestId('update-count').textContent);
    expect(updateCount).toBe(3);
  });

  // ============================================================================
  // TESTE 13: Contagem Final Deve Igualar Inicial Mais Aprovações
  // ============================================================================
  it('deve ter contagem final igual à contagem inicial mais número de aprovações', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('user-stats')).toBeInTheDocument();
      expect(screen.getByTestId('pending-approvals')).toBeInTheDocument();
    }, { timeout: 200 });
    
    // A contagem inicial é 1250
    expect(screen.getByTestId('total-users')).toHaveTextContent('Total Users: 1250');
    
    // Aprovar todos os três utilizadores
    fireEvent.click(screen.getByTestId('approve-btn-1'));
    fireEvent.click(screen.getByTestId('approve-btn-2'));
    fireEvent.click(screen.getByTestId('approve-btn-3'));
    
    await waitFor(() => {
      expect(screen.getByTestId('pending-approvals')).toHaveTextContent('Pending Approvals (0)');
    }, { timeout: 300 });
    
    // A contagem final deve ser 1250 + 3 = 1253
    expect(screen.getByTestId('total-users')).toHaveTextContent('Total Users: 1253');
  });
});
