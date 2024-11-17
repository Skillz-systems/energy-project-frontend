import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressBar from './ProgressBar';


describe('ProgressBar Component', () => {
  test('renders the progress bar with correct percentage', () => {
    render(<ProgressBar percentage={50} />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  test('applies the correct color class based on the percentage', () => {
    const { container } = render(<ProgressBar percentage={95} />);
    const progressBar = container.querySelector('div > div');
    expect(progressBar).toHaveClass('bg-green-300');
  });

  test('renders with a default color when percentage is low', () => {
    const { container } = render(<ProgressBar percentage={20} />);
    const progressBar = container.querySelector('div > div');
    expect(progressBar).toHaveClass('bg-red-500');
  });
});
