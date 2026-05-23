import React, { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../components/common/ErrorBoundary';
import GothicErrorAlert from '../components/common/GothicErrorAlert';

// Healthy child component
const HealthyComponent: React.FC = () => {
  return <div>NODO CENTRAL EN LÍNEA</div>;
};

// Faulty child component that throws an error
interface FaultyComponentProps {
  shouldThrow: boolean;
}

const FaultyComponent: React.FC<FaultyComponentProps> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('CRITICAL_DATABASE_TIMEOUT: Conexión interrumpida.');
  }
  return <div>FLUJO DE INFORMACIÓN CORRECTO</div>;
};

describe('ErrorBoundary & GothicErrorAlert Components Tests', () => {
  it('should render children normally when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <HealthyComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('NODO CENTRAL EN LÍNEA')).toBeInTheDocument();
    expect(screen.queryByText('SISTEMA COMPROMETIDO // APOCALIPSIS DIGITAL')).not.toBeInTheDocument();
  });

  it('should catch runtime rendering errors and render GothicErrorAlert fallback UI', () => {
    // Suppress console.error inside this test block as throwing is expected behavior here
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <FaultyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // Verify Title
    expect(screen.getByText('SISTEMA COMPROMETIDO // APOCALIPSIS DIGITAL')).toBeInTheDocument();
    // Verify default custom feedback message
    expect(
      screen.getByText('Nuestro equipo se encuentra trabajando para solucionar los inconvenientes')
    ).toBeInTheDocument();
    // Verify gears and core restoration elements
    expect(screen.getByText('NÚCLEO EN REPARACIÓN')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('should display the tech log accordion (Códice de Fallos) when clicked', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <FaultyComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // At first, technical details of the error should not be visible
    expect(screen.queryByText('CRITICAL_DATABASE_TIMEOUT: Conexión interrumpida.')).not.toBeInTheDocument();

    // Find and click the toggle button
    const toggleBtn = screen.getByText(/Códice de Fallos del Sistema/i);
    fireEvent.click(toggleBtn);

    // Verify technical details are now visible
    expect(screen.getAllByText(/CRITICAL_DATABASE_TIMEOUT: Conexión interrumpida./)[0]).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('should support resetting the error boundary with the retry button', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Parent wrapper that lets us control whether FaultyComponent throws error or not
    const ResetWrapper = () => {
      const [shouldThrow, setShouldThrow] = useState(true);
      return (
        <div>
          <ErrorBoundary>
            <FaultyComponent shouldThrow={shouldThrow} />
          </ErrorBoundary>
          <button onClick={() => setShouldThrow(false)} data-testid="fix-button">
            Reparar Red
          </button>
        </div>
      );
    };

    render(<ResetWrapper />);

    // Shows gothic error alert initially
    expect(screen.getByText('SISTEMA COMPROMETIDO // APOCALIPSIS DIGITAL')).toBeInTheDocument();

    // Click custom mock fix button to stop throwing
    const fixBtn = screen.getByTestId('fix-button');
    fireEvent.click(fixBtn);

    // Click retry button on Gothic error alert
    const retryBtn = screen.getByRole('button', { name: /REINVOCAR SISTEMA/i });
    fireEvent.click(retryBtn);

    // GothicErrorAlert should disappear and healthy state should be recovered
    expect(screen.queryByText('SISTEMA COMPROMETIDO // APOCALIPSIS DIGITAL')).not.toBeInTheDocument();
    expect(screen.getByText('FLUJO DE INFORMACIÓN CORRECTO')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('GothicErrorAlert can render standalone with custom overrides', () => {
    const mockReset = vi.fn();
    render(
      <GothicErrorAlert
        error="FALTA_FIRMA_DE_S3"
        resetErrorBoundary={mockReset}
        title="ALTAR DE CARGA DE IMÁGENES COMPROMETIDO"
        customMessage="El templo no pudo registrar la reliquia digital"
      />
    );

    expect(screen.getByText('ALTAR DE CARGA DE IMÁGENES COMPROMETIDO')).toBeInTheDocument();
    expect(screen.getByText('El templo no pudo registrar la reliquia digital')).toBeInTheDocument();

    // Click retry
    const retryBtn = screen.getByRole('button', { name: /REINVOCAR SISTEMA/i });
    fireEvent.click(retryBtn);
    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
