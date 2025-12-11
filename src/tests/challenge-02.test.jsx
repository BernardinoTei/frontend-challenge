import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AdminDashboard } from '../challenges/debug-challenge-02-async-data';

describe('Desafio 2: Bugs de Carregamento de Dados Assíncronos', () => {
  
  // ============================================================================
  // TESTE 1: UserStats Deve Mostrar Erro Quando o Fetch Falha
  // ============================================================================
  it('deve mostrar estado de erro quando o fetch de UserStats falha', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('user-stats-error')).toBeInTheDocument();
    }, { timeout: 200 });
    
    expect(screen.getByTestId('user-stats-error')).toHaveTextContent('Failed to fetch user stats');
  });

  // ============================================================================
  // TESTE 2: RecentActivities Deve Carregar Independentemente
  // ============================================================================
  it('deve carregar RecentActivities mesmo quando UserStats falha', async () => {
    render(<AdminDashboard />);
    
    // Aguardar que RecentActivities carregue
    await waitFor(() => {
      expect(screen.getByTestId('recent-activities')).toBeInTheDocument();
    }, { timeout: 300 });
    
    // Verificar que as atividades são exibidas
    expect(screen.getByTestId('activity-1')).toBeInTheDocument();
    expect(screen.getByTestId('activity-2')).toBeInTheDocument();
    expect(screen.getByTestId('activity-3')).toBeInTheDocument();
  });

  // ============================================================================
  // TESTE 3: RecentActivities Não Deve Mostrar Carregamento Após os Dados Carregarem
  // ============================================================================
  it('deve parar de mostrar estado de carregamento em RecentActivities após os dados carregarem', async () => {
    render(<AdminDashboard />);
    
    // Inicialmente, as atividades devem estar a carregar
    expect(screen.getByTestId('activities-loading')).toBeInTheDocument();
    
    // Após as atividades carregarem, deve mostrar as atividades reais
    await waitFor(() => {
      expect(screen.queryByTestId('activities-loading')).not.toBeInTheDocument();
      expect(screen.getByTestId('recent-activities')).toBeInTheDocument();
    }, { timeout: 300 });
  });

  // ============================================================================
  // TESTE 4: Ambos os Componentes Devem Mostrar Estado de Carregamento Inicial
  // ============================================================================
  it('deve mostrar estado de carregamento para ambos os componentes inicialmente', () => {
    render(<AdminDashboard />);
    
    expect(screen.getByTestId('user-stats-loading')).toBeInTheDocument();
    expect(screen.getByTestId('activities-loading')).toBeInTheDocument();
  });

  // ============================================================================
  // TESTE 5: Erro de UserStats Não Deve Afetar Exibição de Atividades
  // ============================================================================
  it('deve exibir atividades corretamente mesmo quando UserStats tem erro', async () => {
    render(<AdminDashboard />);
    
    // Aguardar que ambos terminem de carregar
    await waitFor(() => {
      expect(screen.getByTestId('user-stats-error')).toBeInTheDocument();
    }, { timeout: 200 });
    
    await waitFor(() => {
      expect(screen.getByTestId('recent-activities')).toBeInTheDocument();
    }, { timeout: 300 });
    
    // Verificar conteúdo das atividades
    expect(screen.getByText(/Alice.*Logged in/)).toBeInTheDocument();
    expect(screen.getByText(/Bob.*Updated profile/)).toBeInTheDocument();
    expect(screen.getByText(/Charlie.*Created post/)).toBeInTheDocument();
  });

  // ============================================================================
  // TESTE 6: MainPanel Deve Sempre Ser Renderizado
  // ============================================================================
  it('deve renderizar MainPanel independentemente dos estados dos componentes filhos', async () => {
    render(<AdminDashboard />);
    
    expect(screen.getByTestId('main-panel')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByTestId('main-panel')).toBeInTheDocument();
    }, { timeout: 300 });
  });

  // ============================================================================
  // TESTE 7: Sidebar e TopBar Devem Sempre Estar Visíveis
  // ============================================================================
  it('deve renderizar Sidebar e TopBar independentemente dos estados assíncronos', async () => {
    render(<AdminDashboard />);
    
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('topbar')).toBeInTheDocument();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('topbar')).toBeInTheDocument();
    }, { timeout: 300 });
  });

  // ============================================================================
  // TESTE 8: Atividades Devem Mostrar Número Correto de Itens
  // ============================================================================
  it('deve exibir número correto de itens de atividade', async () => {
    render(<AdminDashboard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('recent-activities')).toBeInTheDocument();
    }, { timeout: 300 });
    
    const activities = screen.getAllByTestId(/^activity-/);
    expect(activities).toHaveLength(3);
  });

  // ============================================================================
  // TESTE 9: Atividades Não Devem Ficar Presas em Estado de Carregamento
  // ============================================================================
  it('não deve deixar RecentActivities preso em estado de carregamento quando UserStats falha', async () => {
    render(<AdminDashboard />);
    
    // Aguardar mais tempo que ambas as operações de fetch
    await waitFor(() => {
      const loadingElement = screen.queryByTestId('activities-loading');
      expect(loadingElement).not.toBeInTheDocument();
    }, { timeout: 500 });
    
    // As atividades devem estar visíveis
    expect(screen.getByTestId('recent-activities')).toBeInTheDocument();
  });

  // ============================================================================
  // TESTE 10: Estado de Carregamento Global Não Deve Bloquear Componentes Bem-Sucedidos
  // ============================================================================
  it('não deve permitir que o estado de carregamento global impeça a renderização de componentes bem-sucedidos', async () => {
    render(<AdminDashboard />);
    
    // Mesmo que UserStats falhe, RecentActivities deve ter sucesso
    await waitFor(() => {
      expect(screen.getByTestId('user-stats-error')).toBeInTheDocument();
      expect(screen.getByTestId('recent-activities')).toBeInTheDocument();
    }, { timeout: 500 });
    
    // Verificar que ambos os estados finais estão corretos
    expect(screen.getByText(/Failed to fetch user stats/)).toBeInTheDocument();
    expect(screen.getByText(/Alice.*Logged in/)).toBeInTheDocument();
  });
});
