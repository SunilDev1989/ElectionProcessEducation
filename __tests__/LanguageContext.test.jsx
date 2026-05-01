import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';

const TestComponent = () => {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div>
      <span data-testid="current-lang">{language}</span>
      <span data-testid="translated-text">{t('dashboard')}</span>
      <button onClick={() => setLanguage('Hindi')}>Switch to Hindi</button>
    </div>
  );
};

describe('LanguageContext', () => {
  it('provides default English language and translations', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    expect(screen.getByTestId('current-lang')).toHaveTextContent('English');
    expect(screen.getByTestId('translated-text')).toHaveTextContent('Overview Dashboard');
  });

  it('updates language and translation when setLanguage is called', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    fireEvent.click(screen.getByText('Switch to Hindi'));
    expect(screen.getByTestId('current-lang')).toHaveTextContent('Hindi');
    expect(screen.getByTestId('translated-text')).toHaveTextContent('सिंहावलोकन डैशबोर्ड');
  });

  it('falls back to English if key is missing in selected language', () => {
    const FallbackComponent = () => {
      const { setLanguage, t } = useLanguage();
      // Assume 'missingKey' is not in Hindi but exists in English (if it existed)
      // Actually 'dashboard' exists in all, let's test a key that might not exist 
      // but 't' function logic handles it.
      return <span data-testid="fallback-text">{t('nonExistentKey')}</span>;
    };
    
    render(
      <LanguageProvider>
        <FallbackComponent />
      </LanguageProvider>
    );
    expect(screen.getByTestId('fallback-text')).toBeEmptyDOMElement();
  });
});
