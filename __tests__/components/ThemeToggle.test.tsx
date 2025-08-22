/* eslint-disable @typescript-eslint/no-explicit-any */

import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import ThemeToggle from '@/app/components/ThemeToggle';

function renderWithTheme(component: any) {
  return render(<ThemeProvider>{component}</ThemeProvider>);
}

describe('ThemeToggle', () => {
  it('should render all theme options', () => {
    renderWithTheme(<ThemeToggle />);
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('should change theme when clicked', () => {
    renderWithTheme(<ThemeToggle />);

    const darkButton = screen.getByText('Dark');
    fireEvent.click(darkButton);
    const { theme } = useTheme();
    expect(theme).toBe('dark');
  });
});
