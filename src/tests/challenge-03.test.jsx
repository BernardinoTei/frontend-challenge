import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PendingApprovals, AdminDashboard } from '../challenges/debug-challenge-03-double-submit';

describe('Desafio 3: Bugs de Duplo Clique / Submissão em Botões', () => {
  
  // ============================================================================
  // TESTE 1: Botão de Aprovação Individual Deve Desativar Durante Processamento
  // ============================================================================
  it('deve desativar o botão de aprovação individual durante o processamento', async () => {
    render(<PendingApprovals />);
    
    const approveBtn = screen.getByTestId('approve-btn-1');
    
    expect(approveBtn).not.toBeDisabled();
    
    fireEvent.click(approveBtn);
    
    expect(approveBtn).toBeDisabled();
    expect(approveBtn).toHaveTextContent('Approving...');
    
    await waitFor(() => {
      expect(screen.getByTestId('status-1')).toHaveTextContent('approved');
    }, { timeout: 200 });
  });

  // ============================================================================
  // TESTE 2: Deve Prevenir Múltiplos Cliques Rápidos no Botão Individual
  // ============================================================================
  it('deve prevenir múltiplos cliques rápidos no botão de aprovação individual', async () => {
    render(<PendingApprovals />);
    
    const approveBtn = screen.getByTestId('approve-btn-1');
    
    // Cliques rápidos em sequência
    fireEvent.click(approveBtn);
    fireEvent.click(approveBtn);
    fireEvent.click(approveBtn);
    fireEvent.click(approveBtn);
    fireEvent.click(approveBtn);
    
    // Aguardar conclusão do processamento
    await waitFor(() => {
      expect(screen.getByTestId('status-1')).toHaveTextContent('approved');
    }, { timeout: 200 });
    
    // Obter o contador de chamadas da API oculto
    const callCounter = screen.getByTestId('api-call-count');
    
    // Deve ser chamado apenas uma vez apesar dos múltiplos cliques
    expect(callCounter).toHaveTextContent('1');
  });

  // ============================================================================
  // TESTE 3: Botão Aprovar Todos Deve Desativar Durante Processamento
  // ============================================================================
  it('deve desativar o botão aprovar todos durante o processamento', async () => {
    render(<PendingApprovals />);
    
    const approveAllBtn = screen.getByTestId('approve-all-btn');
    
    expect(approveAllBtn).not.toBeDisabled();
    
    fireEvent.click(approveAllBtn);
    
    expect(approveAllBtn).toBeDisabled();
    expect(approveAllBtn).toHaveTextContent('Approving All...');
    
    await waitFor(() => {
      expect(screen.getByTestId('approve-all-status')).toHaveTextContent('All items approved!');
    }, { timeout: 300 });
  });

  // ============================================================================
  // TESTE 4: Deve Prevenir Múltiplos Cliques Rápidos no Botão Aprovar Todos
  // ============================================================================
  it('deve prevenir múltiplos cliques rápidos no botão aprovar todos', async () => {
    render(<PendingApprovals />);
    
    const approveAllBtn = screen.getByTestId('approve-all-btn');
    
    // Cliques rápidos em sequência
    fireEvent.click(approveAllBtn);
    fireEvent.click(approveAllBtn);
    fireEvent.click(approveAllBtn);
    fireEvent.click(approveAllBtn);
    
    await waitFor(() => {
      expect(screen.getByTestId('approve-all-status')).toHaveTextContent('All items approved!');
    }, { timeout: 300 });
    
    // Obter o contador de chamadas da API
    const callCounter = screen.getByTestId('api-call-count');
    
    // Deve ser chamado apenas uma vez apesar dos múltiplos cliques
    expect(callCounter).toHaveTextContent('1');
  });

  // ============================================================================
  // TESTE 5: Botões Individuais Devem Estar Desativados Durante Aprovar Todos
  // ============================================================================
  it('deve desativar os botões de aprovação individuais durante a operação aprovar todos', async () => {
    render(<PendingApprovals />);
    
    const approveAllBtn = screen.getByTestId('approve-all-btn');
    const individualBtn1 = screen.getByTestId('approve-btn-1');
    const individualBtn2 = screen.getByTestId('approve-btn-2');
    
    fireEvent.click(approveAllBtn);
    
    // Os botões individuais devem estar desativados ou não clicáveis durante aprovar todos
    expect(individualBtn1).toBeDisabled();
    expect(individualBtn2).toBeDisabled();
    
    await waitFor(() => {
      expect(screen.getByTestId('approve-all-status')).toHaveTextContent('All items approved!');
    }, { timeout: 300 });
  });

  // ============================================================================
  // TESTE 6: Clicar em Botão Individual Durante Aprovar Todos Não Deve Funcionar
  // ============================================================================
  it('não deve permitir clicar em botões individuais durante aprovar todos', async () => {
    render(<PendingApprovals />);
    
    const approveAllBtn = screen.getByTestId('approve-all-btn');
    const individualBtn = screen.getByTestId('approve-btn-1');
    
    // Iniciar aprovar todos
    fireEvent.click(approveAllBtn);
    
    // Tentar clicar no botão individual durante aprovar todos
    fireEvent.click(individualBtn);
    fireEvent.click(individualBtn);
    
    await waitFor(() => {
      expect(screen.getByTestId('approve-all-status')).toHaveTextContent('All items approved!');
    }, { timeout: 300 });
    
    // A API deve ser chamada apenas uma vez (para aprovar todos)
    const callCounter = screen.getByTestId('api-call-count');
    expect(callCounter).toHaveTextContent('1');
  });

  // ============================================================================
  // TESTE 7: Contagem Pendente Deve Atualizar Corretamente
  // ============================================================================
  it('deve atualizar a contagem pendente após aprovação', async () => {
    render(<PendingApprovals />);
    
    expect(screen.getByTestId('header')).toHaveTextContent('Pending Approvals (3)');
    
    const approveBtn = screen.getByTestId('approve-btn-1');
    fireEvent.click(approveBtn);
    
    await waitFor(() => {
      expect(screen.getByTestId('status-1')).toHaveTextContent('approved');
    }, { timeout: 200 });
    
    expect(screen.getByTestId('header')).toHaveTextContent('Pending Approvals (2)');
  });

  // ============================================================================
  // TESTE 8: Botão Aprovar Todos Deve Desativar Quando Não Há Itens Pendentes
  // ============================================================================
  it('deve desativar o botão aprovar todos quando todos os itens estão aprovados', async () => {
    render(<PendingApprovals />);
    
    const approveAllBtn = screen.getByTestId('approve-all-btn');
    
    fireEvent.click(approveAllBtn);
    
    await waitFor(() => {
      expect(screen.getByTestId('approve-all-status')).toHaveTextContent('All items approved!');
    }, { timeout: 300 });
    
    expect(approveAllBtn).toBeDisabled();
    expect(screen.getByTestId('header')).toHaveTextContent('Pending Approvals (0)');
  });

  // ============================================================================
  // TESTE 9: Não Deve Permitir Aprovar Itens Já Aprovados
  // ============================================================================
  it('não deve permitir aprovar novamente itens já aprovados', async () => {
    render(<PendingApprovals />);
    
    const approveBtn = screen.getByTestId('approve-btn-1');
    
    // Primeira aprovação
    fireEvent.click(approveBtn);
    
    await waitFor(() => {
      expect(screen.getByTestId('status-1')).toHaveTextContent('approved');
    }, { timeout: 200 });
    
    const callCountAfterFirst = screen.getByTestId('api-call-count').textContent;
    
    // Tentar aprovar novamente
    const approvedBtn = screen.getByTestId('approve-btn-1');
    fireEvent.click(approvedBtn);
    fireEvent.click(approvedBtn);
    
    // Aguardar um pouco
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // A contagem de chamadas da API não deve aumentar
    expect(screen.getByTestId('api-call-count')).toHaveTextContent(callCountAfterFirst);
  });

  // ============================================================================
  // TESTE 10: Múltiplos Itens Podem Ser Aprovados Sequencialmente
  // ============================================================================
  it('deve permitir aprovar múltiplos itens sequencialmente', async () => {
    render(<PendingApprovals />);
    
    // Aprovar primeiro item
    fireEvent.click(screen.getByTestId('approve-btn-1'));
    
    await waitFor(() => {
      expect(screen.getByTestId('status-1')).toHaveTextContent('approved');
    }, { timeout: 200 });
    
    // Aprovar segundo item
    fireEvent.click(screen.getByTestId('approve-btn-2'));
    
    await waitFor(() => {
      expect(screen.getByTestId('status-2')).toHaveTextContent('approved');
    }, { timeout: 200 });
    
    // Verificar que ambos estão aprovados
    expect(screen.getByTestId('status-1')).toHaveTextContent('approved');
    expect(screen.getByTestId('status-2')).toHaveTextContent('approved');
    expect(screen.getByTestId('header')).toHaveTextContent('Pending Approvals (1)');
  });

  // ============================================================================
  // TESTE 11: Mensagens de Estado Devem Exibir Corretamente
  // ============================================================================
  it('deve exibir mensagens de estado corretas durante o processo de aprovação', async () => {
    render(<PendingApprovals />);
    
    const approveAllBtn = screen.getByTestId('approve-all-btn');
    
    // Inicialmente sem estado
    expect(screen.queryByTestId('approve-all-status')).not.toBeInTheDocument();
    
    fireEvent.click(approveAllBtn);
    
    // Deve mostrar estado de processamento
    expect(screen.getByTestId('approve-all-status')).toHaveTextContent('Processing all approvals...');
    
    // Deve mostrar estado de sucesso
    await waitFor(() => {
      expect(screen.getByTestId('approve-all-status')).toHaveTextContent('All items approved!');
    }, { timeout: 300 });
  });

  // ============================================================================
  // TESTE 12: Todos os Itens Devem Ser Renderizados
  // ============================================================================
  it('deve renderizar todos os itens de aprovação', () => {
    render(<PendingApprovals />);
    
    expect(screen.getByTestId('approval-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('approval-item-2')).toBeInTheDocument();
    expect(screen.getByTestId('approval-item-3')).toBeInTheDocument();
  });

  // ============================================================================
  // TESTE 13: AdminDashboard Deve Renderizar o Componente PendingApprovals
  // ============================================================================
  it('deve renderizar aprovações pendentes dentro do painel de administração', () => {
    render(<AdminDashboard />);
    
    expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('topbar')).toBeInTheDocument();
    expect(screen.getByTestId('pending-approvals')).toBeInTheDocument();
  });
});
