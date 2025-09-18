import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import MessageBubble from '@/components/agent/MessageBubble.jsx';

describe('MessageBubble', () => {
  it('renders markdown بدون تحذيرات', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(<MessageBubble message={{ role: 'assistant', content: '**bold** _it_' }} />);

    expect(screen.getByText('bold', { exact: false })).toBeInTheDocument();
    expect(errorSpy).not.toHaveBeenCalled();
    expect(warnSpy).not.toHaveBeenCalled();

    errorSpy.mockRestore();
    warnSpy.mockRestore();
  });
});
