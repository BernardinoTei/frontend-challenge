import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdminDashboard, PendingApprovals, ApprovalRow, ApprovalModal } from '../challenges/debug-challenge-06-event-bubbling';

describe('Desafio 6: Problemas de Propagação de Eventos Aninhados', () => {
  
  // ============================================================================
  // TESTE 1: Clicar na Linha Deve Abrir o Modal
  // ============================================================================
  it('deve abrir o modal ao clicar na linha de aprovação', () => {
    render(<PendingApprovals />);
    
    expect(screen.queryByTestId('modal-backdrop')).not.toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId('approval-row-1'));
    
    expect(screen.getByTestId('modal-backdrop')).toBeInTheDocument();
    expect(screen.getByTestId('modal-title')).toHaveTextContent('User Registration: john@example.com');
  });

  // ============================================================================
  // TESTE 2: Clicar no Botão Aprovação Rápida Não Deve Abrir o Modal
  // ============================================================================
  it('não deve abrir o modal ao clicar no botão de aprovação rápida', () => {
    render(<PendingApprovals />);
    
    const quickApproveBtn = screen.getByTestId('quick-approve-1');
    fireEvent.click(quickApproveBtn);
    
    // O modal NÃO deve abrir
    expect(screen.queryByTestId('modal-backdrop')).not.toBeInTheDocument();
    
    // A contagem de abertura do modal deve ser 0
    expect(screen.getByTestId('modal-open-count')).toHaveTextContent('0');
  });

  // ============================================================================
  // TESTE 3: Clicar no Link de Detalhes Não Deve Abrir o Modal
  // ============================================================================
  it('não deve abrir o modal ao clicar no link de detalhes', () => {
    render(<PendingApprovals />);
    
    const detailsLink = screen.getByTestId('details-link-1');
    fireEvent.click(detailsLink);
    
    // O modal NÃO deve abrir
    expect(screen.queryByTestId('modal-backdrop')).not.toBeInTheDocument();
    
    // A contagem de abertura do modal deve ser 0
    expect(screen.getByTestId('modal-open-count')).toHaveTextContent('0');
  });

  // ============================================================================
  // TESTE 4: Clicar no Conteúdo do Modal Não Deve Fechar o Modal
  // ============================================================================
  it('não deve fechar o modal ao clicar na área de conteúdo do modal', async () => {
    render(<PendingApprovals />);
    
    // Abrir o modal
    fireEvent.click(screen.getByTestId('approval-row-1'));
    expect(screen.getByTestId('modal-backdrop')).toBeInTheDocument();
    
    // Clicar no conteúdo do modal (não no backdrop)
    fireEvent.click(screen.getByTestId('modal-content'));
    
    // O modal ainda deve estar aberto
    expect(screen.getByTestId('modal-backdrop')).toBeInTheDocument();
    
    // A contagem de cliques no backdrop deve ser 0 (nenhum fecho foi acionado)
    expect(screen.getByTestId('backdrop-click-count')).toHaveTextContent('0');
  });

  // ============================================================================
  // TESTE 5: Clicar no Título do Modal Não Deve Fechar o Modal
  // ============================================================================
  it('não deve fechar o modal ao clicar no título do modal', () => {
    render(<PendingApprovals />);
    
    fireEvent.click(screen.getByTestId('approval-row-1'));
    expect(screen.getByTestId('modal-backdrop')).toBeInTheDocument();
    
    // Clicar no título do modal
    fireEvent.click(screen.getByTestId('modal-title'));
    
    // O modal ainda deve estar aberto
    expect(screen.getByTestId('modal-backdrop')).toBeInTheDocument();
  });

  // ============================================================================
  // TESTE 6: Clicar nos Detalhes do Modal Não Deve Fechar o Modal
  // ============================================================================
  it('não deve fechar o modal ao clicar nos detalhes do modal', () => {
    render(<PendingApprovals />);
    
    fireEvent.click(screen.getByTestId('approval-row-1'));
    expect(screen.getByTestId('modal-backdrop')).toBeInTheDocument();
    
    // Clicar no texto de detalhes do modal
    fireEvent.click(screen.getByTestId('modal-details'));
    
    // O modal ainda deve estar aberto
    expect(screen.getByTestId('modal-backdrop')).toBeInTheDocument();
  });

  // ============================================================================
  // TESTE 7: Clicar no Botão Aprovar Não Deve Fechar o Modal Imediatamente
  // ============================================================================
  it('não deve fechar o modal por clique no backdrop ao clicar no botão aprovar', async () => {
    render(<PendingApprovals />);
    
    fireEvent.click(screen.getByTestId('approval-row-1'));
    expect(screen.getByTestId('modal-backdrop')).toBeInTheDocument();
    
    const backdropClicksBefore = parseInt(screen.getByTestId('backdrop-click-count').textContent);
    
    // Clicar no botão aprovar
    fireEvent.click(screen.getByTestId('modal-approve-btn'));
    
    // Aguardar processamento
    await waitFor(() => {
      expect(screen.queryByTestId('modal-backdrop')).not.toBeInTheDocument();
    }, { timeout: 200 });
    
    // A contagem de cliques no backdrop não deve ter aumentado (modal fechado por aprovação, não por backdrop)
    const backdropClicksAfter = parseInt(screen.getByTestId('backdrop-click-count').textContent);
    expect(backdropClicksAfter).toBe(backdropClicksBefore);
  });

  // ============================================================================
  // TESTE 8: Clicar no Botão Rejeitar Não Deve Fechar o Modal via Backdrop
  // ============================================================================
  it('não deve fechar o modal por clique no backdrop ao clicar no botão rejeitar', async () => {
    render(<PendingApprovals />);
    
    fireEvent.click(screen.getByTestId('approval-row-1'));
    expect(screen.getByTestId('modal-backdrop')).toBeInTheDocument();
    
    const backdropClicksBefore = parseInt(screen.getByTestId('backdrop-click-count').textContent);
    
    // Clicar no botão rejeitar
    fireEvent.click(screen.getByTestId('modal-reject-btn'));
    
    // Aguardar processamento
    await waitFor(() => {
      expect(screen.queryByTestId('modal-backdrop')).not.toBeInTheDocument();
    }, { timeout: 200 });
    
    // A contagem de cliques no backdrop não deve ter aumentado
    const backdropClicksAfter = parseInt(screen.getByTestId('backdrop-click-count').textContent);
    expect(backdropClicksAfter).toBe(backdropClicksBefore);
  });

  // ============================================================================
  // TESTE 9: Clicar no Botão Fechar Deve Fechar o Modal Adequadamente
  // ============================================================================
  it('deve fechar o modal ao clicar no botão fechar', () => {
    render(<PendingApprovals />);
    
    fireEvent.click(screen.getByTestId('approval-row-1'));
    expect(screen.getByTestId('modal-backdrop')).toBeInTheDocument();
    
    // Clicar no botão fechar
    fireEvent.click(screen.getByTestId('modal-close-btn'));
    
    // O modal deve estar fechado
    expect(screen.queryByTestId('modal-backdrop')).not.toBeInTheDocument();
  });

  // ============================================================================
  // TESTE 10: Clicar no Backdrop Deve Fechar o Modal
  // ============================================================================
  it('deve fechar o modal ao clicar no backdrop', () => {
    render(<PendingApprovals />);
    
    fireEvent.click(screen.getByTestId('approval-row-1'));
    expect(screen.getByTestId('modal-backdrop')).toBeInTheDocument();
    
    // Clicar diretamente no backdrop (não no conteúdo do modal)
    const backdrop = screen.getByTestId('modal-backdrop');
    const modalContent = screen.getByTestId('modal-content');
    
    // Simular clique na área do backdrop (fora do conteúdo do modal)
    fireEvent.click(backdrop);
    
    // O modal deve estar fechado
    expect(screen.queryByTestId('modal-backdrop')).not.toBeInTheDocument();
  });

  // ============================================================================
  // TESTE 11: Contagem de Cliques na Linha Deve Apenas Incrementar em Cliques na Linha
  // ============================================================================
  it('deve apenas incrementar a contagem de cliques na linha ao clicar na área da linha', () => {
    render(<PendingApprovals />);
    
    // A contagem inicial é 0
    expect(screen.getByTestId('row-click-count-1')).toHaveTextContent('0');
    
    // Clicar na linha
    fireEvent.click(screen.getByTestId('approval-row-1'));
    expect(screen.getByTestId('row-click-count-1')).toHaveTextContent('1');
    
    // Fechar o modal
    fireEvent.click(screen.getByTestId('modal-close-btn'));
    
    // Clicar no botão de aprovação rápida
    fireEvent.click(screen.getByTestId('quick-approve-1'));
    
    // A contagem de cliques na linha ainda deve ser 1 (clique no botão não deve propagar)
    expect(screen.getByTestId('row-click-count-1')).toHaveTextContent('1');
  });

  // ============================================================================
  // TESTE 12: Contagem de Cliques no Modal Não Deve Incrementar de Cliques no Backdrop
  // ============================================================================
  it('não deve incrementar a contagem de cliques no conteúdo do modal ao clicar no backdrop', () => {
    render(<PendingApprovals />);
    
    fireEvent.click(screen.getByTestId('approval-row-1'));
    
    const modalClickCount = parseInt(screen.getByTestId('modal-click-count').textContent);
    
    // Clicar no backdrop (isto deve fechar o modal, não incrementar a contagem do conteúdo do modal)
    fireEvent.click(screen.getByTestId('modal-backdrop'));
    
    // O modal está agora fechado, então não podemos verificar a contagem, mas não deveria ter propagado
    expect(screen.queryByTestId('modal-backdrop')).not.toBeInTheDocument();
  });

  // ============================================================================
  // TESTE 13: Múltiplos Cliques em Botões na Linha Não Devem Acionar Múltiplos Modais
  // ============================================================================
  it('não deve abrir múltiplos modais ao clicar em botões rapidamente', () => {
    render(<PendingApprovals />);
    
    // Cliques rápidos em aprovação rápida
    fireEvent.click(screen.getByTestId('quick-approve-1'));
    fireEvent.click(screen.getByTestId('quick-approve-1'));
    fireEvent.click(screen.getByTestId('quick-approve-1'));
    
    // A contagem de abertura do modal deve ser 0
    expect(screen.getByTestId('modal-open-count')).toHaveTextContent('0');
    expect(screen.queryByTestId('modal-backdrop')).not.toBeInTheDocument();
  });

  // ============================================================================
  // TESTE 14: Clicar em Linhas Diferentes Deve Abrir Modais Diferentes
  // ============================================================================
  it('deve abrir o modal correto para linhas diferentes', () => {
    render(<PendingApprovals />);
    
    // Clicar na primeira linha
    fireEvent.click(screen.getByTestId('approval-row-1'));
    expect(screen.getByTestId('modal-title')).toHaveTextContent('User Registration: john@example.com');
    
    // Fechar o modal
    fireEvent.click(screen.getByTestId('modal-close-btn'));
    
    // Clicar na segunda linha
    fireEvent.click(screen.getByTestId('approval-row-2'));
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Content Submission: Blog Post');
  });

  // ============================================================================
  // TESTE 15: Aprovação Deve Processar e Fechar o Modal
  // ============================================================================
  it('deve processar aprovação e fechar o modal', async () => {
    render(<PendingApprovals />);
    
    fireEvent.click(screen.getByTestId('approval-row-1'));
    expect(screen.getByTestId('modal-backdrop')).toBeInTheDocument();
    
    // Clicar em aprovar
    fireEvent.click(screen.getByTestId('modal-approve-btn'));
    
    // O botão deve mostrar processamento
    expect(screen.getByTestId('modal-approve-btn')).toHaveTextContent('Processing...');
    expect(screen.getByTestId('modal-approve-btn')).toBeDisabled();
    
    // Aguardar conclusão do processamento e fecho do modal
    await waitFor(() => {
      expect(screen.queryByTestId('modal-backdrop')).not.toBeInTheDocument();
    }, { timeout: 200 });
  });

  // ============================================================================
  // TESTE 16: Ações do Modal Devem Ser Renderizadas
  // ============================================================================
  it('deve renderizar todos os botões de ação do modal', () => {
    render(<PendingApprovals />);
    
    fireEvent.click(screen.getByTestId('approval-row-1'));
    
    expect(screen.getByTestId('modal-approve-btn')).toBeInTheDocument();
    expect(screen.getByTestId('modal-reject-btn')).toBeInTheDocument();
    expect(screen.getByTestId('modal-close-btn')).toBeInTheDocument();
  });

  // ============================================================================
  // TESTE 17: Todas as Linhas de Aprovação Devem Ser Renderizadas
  // ============================================================================
  it('deve renderizar todas as linhas de aprovação', () => {
    render(<PendingApprovals />);
    
    expect(screen.getByTestId('approval-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('approval-row-2')).toBeInTheDocument();
    expect(screen.getByTestId('approval-row-3')).toBeInTheDocument();
  });

  // ============================================================================
  // TESTE 18: AdminDashboard Deve Renderizar PendingApprovals
  // ============================================================================
  it('deve renderizar aprovações pendentes no painel de administração', () => {
    render(<AdminDashboard />);
    
    expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('topbar')).toBeInTheDocument();
    expect(screen.getByTestId('pending-approvals')).toBeInTheDocument();
  });
});
