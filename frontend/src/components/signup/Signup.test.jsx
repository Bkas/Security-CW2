import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store'; 
import Signup from './Signup';
import { server } from '../mocks/server'; 

const mockStore = configureStore([]);

describe('Signup', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  it('renders correctly', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      </Provider>
    );

    const titleElem = screen.getByText('Sign Up');
    expect(titleElem).toBeInTheDocument();
  });

  it('handles successful registration', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      </Provider>
    );

    const usernameInput = screen.getByPlaceholderText('Type username');
    const emailInput = screen.getByPlaceholderText('Type email');
    const passwordInput = screen.getByPlaceholderText('Type password');
    const signupButton = screen.getByText('Sign Up');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signupButton);

    await waitFor(() => {
      // You may need to adjust this selector based on your actual implementation
      const successMessage = screen.getByText('Welcome to our app!');
      expect(successMessage).toBeInTheDocument();
    });
  });

  it('handles registration error', async () => {
    server.use(
      rest.post('http://localhost:5000/auth/register', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      </Provider>
    );

    const usernameInput = screen.getByPlaceholderText('Type username');
    const emailInput = screen.getByPlaceholderText('Type email');
    const passwordInput = screen.getByPlaceholderText('Type password');
    const signupButton = screen.getByText('Sign Up');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signupButton);

    await waitFor(() => {
      const errorMessage = screen.getByText('Wrong credentials! Try different ones.');
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
