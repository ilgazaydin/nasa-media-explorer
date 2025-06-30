// Test stub for PublicLayout
import { screen } from '@testing-library/react';
import { vi } from 'vitest';
import PublicLayout from '../PublicLayout';
import * as hooks from '@/app/hooks';
import { renderWithProviders } from '@/test/utils';

vi.mock('@/app/hooks');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div>Outlet</div>,
    Navigate: ({ to }: { to: string }) => <div>Navigate to {to}</div>,
  };
});

describe('PublicLayout', () => {
  it('redirects to / if authenticated', () => {
    (hooks.useAppSelector as any).mockImplementation(() => ({ accessToken: 'token', user: { name: 'Jane' } }));
    renderWithProviders(<PublicLayout />);
    expect(screen.getByText('Navigate to /')).toBeInTheDocument();
  });

  it('renders Outlet if not authenticated', () => {
    (hooks.useAppSelector as any).mockImplementation(() => ({ accessToken: null, user: null }));
    renderWithProviders(<PublicLayout />);
    expect(screen.getByText('Outlet')).toBeInTheDocument();
  });
});
