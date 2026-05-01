import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';
import { LanguageProvider } from '@/context/LanguageContext';

// Mock the next/dynamic import for Timeline
jest.mock('next/dynamic', () => () => {
  const DynamicComponent = () => <div data-testid="mock-timeline">Timeline Mock</div>;
  return DynamicComponent;
});

describe('Home Dashboard Component', () => {
  it('renders the core dashboard metrics', () => {
    render(
      <LanguageProvider>
        <Home />
      </LanguageProvider>
    );
    
    // Check if the dashboard title loads
    expect(screen.getByText('Overview Dashboard')).toBeInTheDocument();
    
    // Check if the static KPIs load
    expect(screen.getByText('980M+')).toBeInTheDocument();
    expect(screen.getByText('1.2M')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders the analyze manifesto button', () => {
    render(
      <LanguageProvider>
        <Home />
      </LanguageProvider>
    );
    
    const analyzeButton = screen.getByText('Analyze Manifesto');
    expect(analyzeButton).toBeInTheDocument();
    // Assuming Button is converted to an 'a' tag by MUI href
    expect(analyzeButton.closest('a')).toHaveAttribute('href', '/manifesto');
  });

  it('renders the dynamic timeline component placeholder', () => {
    render(
      <LanguageProvider>
        <Home />
      </LanguageProvider>
    );
    
    expect(screen.getByTestId('mock-timeline')).toBeInTheDocument();
  });
});
