import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import HomePage from './page';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    back: vi.fn(),
    push: vi.fn(),
  }),
}));

describe('HomePage', () => {
  it('renders the first-design-complete home artboard', () => {
    render(<HomePage />);

    expect(screen.getByText('02 홈 · 1차 디자인 완료')).toBeInTheDocument();
    expect(screen.getByText('teameet')).toBeInTheDocument();
    expect(screen.getByLabelText('검색')).toBeInTheDocument();
  });
});
