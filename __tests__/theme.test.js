import theme from '../src/app/theme';

describe('Material-UI Theme Configuration', () => {
  it('defines the correct primary and secondary colors', () => {
    expect(theme.palette.primary.main).toBe('#FF9933'); // Saffron
    expect(theme.palette.secondary.main).toBe('#138808'); // Green
  });

  it('sets the correct typography font family', () => {
    expect(theme.typography.fontFamily).toContain('Inter');
  });

  it('sets the correct global border radius', () => {
    expect(theme.shape.borderRadius).toBe(12);
  });
});
