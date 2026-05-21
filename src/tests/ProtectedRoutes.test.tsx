import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from '../Routes/ProtectedRoutes';

// Create standard mock hooks
const mockUseAuth = vi.fn();
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('ProtectedRoutes Guards Tests', () => {
  it('should render Spinner when loading is true', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      profile: null,
      loading: true,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Dashboard Secreto</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Should find the spinner node
    expect(screen.queryByText('Dashboard Secreto')).not.toBeInTheDocument();
  });

  it('should redirect to /login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      profile: null,
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={['/secret-node']}>
        <Routes>
          <Route
            path="/secret-node"
            element={
              <ProtectedRoute>
                <div data-testid="secret">Dashboard Secreto</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div data-testid="login">Login Node</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByTestId('secret')).not.toBeInTheDocument();
    expect(screen.getByTestId('login')).toBeInTheDocument();
  });

  it('should render children when user is authenticated under ProtectedRoute', () => {
    mockUseAuth.mockReturnValue({
      user: { uid: 'u-123', email: 'street@neon.com' },
      profile: { uid: 'u-123', role: 'customer' },
      loading: false,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div data-testid="secret">Dashboard Secreto</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId('secret')).toBeInTheDocument();
  });

  it('should redirect customer to root (/) when accessing AdminRoute', () => {
    mockUseAuth.mockReturnValue({
      user: { uid: 'u-123', email: 'street@neon.com' },
      profile: { uid: 'u-123', role: 'customer' }, // Customer, not admin
      loading: false,
    });

    render(
      <MemoryRouter initialEntries={['/admin-console']}>
        <Routes>
          <Route
            path="/admin-console"
            element={
              <AdminRoute>
                <div data-testid="admin">Consola de Control</div>
              </AdminRoute>
            }
          />
          <Route path="/" element={<div data-testid="home">Home Node</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByTestId('admin')).not.toBeInTheDocument();
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });

  it('should render children for AdminRoute when authenticated as admin', () => {
    mockUseAuth.mockReturnValue({
      user: { uid: 'admin-123', email: 'admin@neon.com' },
      profile: { uid: 'admin-123', role: 'admin' }, // Admin role
      loading: false,
    });

    render(
      <MemoryRouter>
        <AdminRoute>
          <div data-testid="admin">Consola de Control</div>
        </AdminRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId('admin')).toBeInTheDocument();
  });
});
