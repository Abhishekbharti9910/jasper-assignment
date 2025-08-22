import React from 'react';
import { render, screen, fireEvent, renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../../src/context/ThemeContext';
import ThemeToggle from '../../src/app/components/ThemeToggle';


const TestComponent = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <ThemeToggle />
      <div data-testid="current-theme">{theme}</div>
      <button onClick={() => setTheme('dark')} data-testid="set-dark">Set Dark</button>
    </div>
  );
};

const renderWithTheme = (component) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('ThemeToggle', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should render all theme options', () => {
    renderWithTheme(<ThemeToggle />);
    
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });


  it('should change theme when clicked', () => {
    renderWithTheme(<TestComponent />);

 
    const themeDisplay = screen.getByTestId('current-theme');
    expect(themeDisplay).toHaveTextContent('system'); // default theme

    const darkButton = screen.getByText('Dark');
    fireEvent.click(darkButton);
    expect(themeDisplay).toHaveTextContent('dark');


    const lightButton = screen.getByText('Light');
    fireEvent.click(lightButton);
    expect(themeDisplay).toHaveTextContent('light');
  });


  it('should update theme using renderHook', () => {
    const wrapper = ({ children }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    // Test initial state
    expect(result.current.theme).toBe('system');

    // Test theme change
    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
  });
});