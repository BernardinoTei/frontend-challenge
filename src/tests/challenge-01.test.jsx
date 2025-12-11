import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrokenSubmitButton } from '../challenges/debug-challenge-01-double-click';

describe('Desafio 1: Bug de Duplo Clique', () => {
  
  // ============================================================================
  // TESTE 1: Botão Deve Desativar Durante Submissão
  // ============================================================================
  it('deve desativar o botão durante a submissão', async () => {
    const mockSubmit = vi.fn(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<BrokenSubmitButton onSubmit={mockSubmit} />);
    
    const button = screen.getByTestId('submit-button');
    
    expect(button).not.toBeDisabled();
    
    fireEvent.click(button);
    
    expect(button).toBeDisabled();
    
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    }, { timeout: 200 });
  });

  // ============================================================================
  // TESTE 2: Prevenir Múltiplos Cliques Rápidos
  // ============================================================================
  it('deve prevenir múltiplos cliques rápidos', async () => {
    let resolveSubmit;
    const mockSubmit = vi.fn(() => 
      new Promise(resolve => {
        resolveSubmit = resolve;
      })
    );

    render(<BrokenSubmitButton onSubmit={mockSubmit} />);
    
    const button = screen.getByTestId('submit-button');
    
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    
    expect(mockSubmit).toHaveBeenCalledTimes(1);
    
    resolveSubmit();
    
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  // ============================================================================
  // TESTE 3: Mostrar Estado de Carregamento Durante Submissão
  // ============================================================================
  it('deve mostrar estado de carregamento durante a submissão', async () => {
    const mockSubmit = vi.fn(() => 
      new Promise(resolve => setTimeout(resolve, 50))
    );

    render(<BrokenSubmitButton onSubmit={mockSubmit} />);
    
    const button = screen.getByTestId('submit-button');
    
    fireEvent.click(button);
    
    const statusMessage = screen.getByTestId('status-message');
    expect(statusMessage).toHaveTextContent('Submitting...');
    
    await waitFor(() => {
      expect(screen.getByTestId('status-message')).toHaveTextContent('Success!');
    }, { timeout: 100 });
  });

  // ============================================================================
  // TESTE 4: Reativar Botão Após Submissão Bem-Sucedida
  // ============================================================================
  it('deve reativar o botão após submissão bem-sucedida', async () => {
    const mockSubmit = vi.fn(() => Promise.resolve());

    render(<BrokenSubmitButton onSubmit={mockSubmit} />);
    
    const button = screen.getByTestId('submit-button');
    
    fireEvent.click(button);
    
    expect(button).toBeDisabled();
    
    await waitFor(() => {
      expect(button).not.toBeDisabled();
      expect(screen.getByTestId('status-message')).toHaveTextContent('Success!');
    });
    
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });

  // ============================================================================
  // TESTE 5: Reativar Botão Após Submissão Falhada
  // ============================================================================
  it('deve reativar o botão após submissão falhada', async () => {
    const mockSubmit = vi.fn(() => Promise.reject(new Error('Network error')));

    render(<BrokenSubmitButton onSubmit={mockSubmit} />);
    
    const button = screen.getByTestId('submit-button');
    
    fireEvent.click(button);
    
    expect(button).toBeDisabled();
    
    await waitFor(() => {
      expect(button).not.toBeDisabled();
      expect(screen.getByTestId('status-message')).toHaveTextContent('Error!');
    });
    
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });

  // ============================================================================
  // TESTE 6: Sem Mensagem de Estado Antes do Primeiro Clique
  // ============================================================================
  it('não deve mostrar mensagem de estado antes do primeiro clique', () => {
    const mockSubmit = vi.fn();

    render(<BrokenSubmitButton onSubmit={mockSubmit} />);
    
    expect(screen.queryByTestId('status-message')).not.toBeInTheDocument();
  });

  // ============================================================================
  // TESTE 7: Botão Pode Ser Clicado Novamente Após Sucesso
  // ============================================================================
  it('deve permitir clicar novamente após submissão bem-sucedida', async () => {
    const mockSubmit = vi.fn(() => Promise.resolve());

    render(<BrokenSubmitButton onSubmit={mockSubmit} />);
    
    const button = screen.getByTestId('submit-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(button).not.toBeDisabled();
      expect(screen.getByTestId('status-message')).toHaveTextContent('Success!');
    });
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
    
    expect(mockSubmit).toHaveBeenCalledTimes(2);
  });

  // ============================================================================
  // TESTE 8: Tratar Operações de Longa Duração
  // ============================================================================
  it('deve tratar operações de longa duração corretamente', async () => {
    const mockSubmit = vi.fn(() => 
      new Promise(resolve => setTimeout(resolve, 500))
    );

    render(<BrokenSubmitButton onSubmit={mockSubmit} />);
    
    const button = screen.getByTestId('submit-button');
    
    fireEvent.click(button);
    
    expect(button).toBeDisabled();
    
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(button).toBeDisabled();
    
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(button).toBeDisabled();
    
    await waitFor(() => {
      expect(button).not.toBeDisabled();
      expect(screen.getByTestId('status-message')).toHaveTextContent('Success!');
    }, { timeout: 600 });
  });

  // ============================================================================
  // TESTE 9: Cliques Consecutivos Após Reativação
  // ============================================================================
  it('deve prevenir cliques rápidos mesmo em submissões subsequentes', async () => {
    const mockSubmit = vi.fn(() => 
      new Promise(resolve => setTimeout(resolve, 50))
    );

    render(<BrokenSubmitButton onSubmit={mockSubmit} />);
    
    const button = screen.getByTestId('submit-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
    
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
    
    expect(mockSubmit).toHaveBeenCalledTimes(2);
  });

  // ============================================================================
  // TESTE 10: Mensagem de Estado Persiste Após Conclusão
  // ============================================================================
  it('deve manter a mensagem de estado visível após conclusão', async () => {
    const mockSubmit = vi.fn(() => Promise.resolve());

    render(<BrokenSubmitButton onSubmit={mockSubmit} />);
    
    const button = screen.getByTestId('submit-button');
    
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
    
    const statusMessage = screen.getByTestId('status-message');
    expect(statusMessage).toBeInTheDocument();
    expect(statusMessage).toHaveTextContent('Success!');
  });
});
