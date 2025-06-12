import { validateEmail, validatePhone } from '../src/validation';

describe('Email Validation', () => {
  it('should pass for valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  it('should fail for invalid email', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });
});

describe('Phone Validation', () => {
  it('should pass for valid phone number', () => {
    expect(validatePhone('+1 (555) 123-4567')).toBe(true);
  });

  it('should fail for too short number', () => {
    expect(validatePhone('123')).toBe(false);
  });

  it('should fail for letters in number', () => {
    expect(validatePhone('abc-123-4567')).toBe(false);
  });
});
