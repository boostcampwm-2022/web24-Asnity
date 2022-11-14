import { render } from '@testing-library/react';
import React from 'react';

import App from './App';

describe('App Component', () => {
  it('텍스트 노드를 렌더링해야 한다.', () => {
    const { getByText } = render(<App />);
    const text = getByText('App');

    expect(text).toBeInTheDocument();
  });
});
