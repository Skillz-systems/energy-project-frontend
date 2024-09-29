
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LogoComponent from './LogoComponent';
import React from 'react';


describe('LogoComponent', () => {
  it('renders with the nav variant', () => {
    render(<LogoComponent variant="nav" />);
    const logo = screen.getByAltText('Company Logo');
    expect(logo).toHaveClass('w-[32px] h-[32px] rounded-md');
  });

  it('renders with the auth variant', () => {
    render(<LogoComponent variant="auth" />);
    const logo = screen.getByAltText('Company Logo');
    expect(logo).toHaveClass('w-[120px] h-[120px] rounded-full');
  });
});
