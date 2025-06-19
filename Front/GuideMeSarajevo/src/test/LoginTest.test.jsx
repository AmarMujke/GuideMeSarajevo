import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../components/Login';
import { AuthProvider } from '../context/AuthContext'; 
import '@testing-library/jest-dom';


jest.mock('../helpers/api', () => ({
  post: jest.fn(() => Promise.reject({ response: { data: "Invalid credentials" } }))
}));

test('renders login form and submits with error', async () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthProvider>
  );

  const emailInput = screen.getByPlaceholderText('Email');
  const passwordInput = screen.getByPlaceholderText('Password');
  const submitButton = screen.getByRole('button', { name: /login/i });

  fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });

  fireEvent.click(submitButton);

  const errorMessage = await screen.findByText('Invalid credentials');
  expect(errorMessage).toBeInTheDocument();
});
