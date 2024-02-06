import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store'; 
import { server } from '../mocks/server';
import Login from './Login';

const mockStore = configureStore([]);

describe('Login', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  it('renders correctly', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    const titleElem = screen.getByText('Login');
    expect(titleElem).toBeInTheDocument();
  });

  it('handles login with correct credentials', async () => {
    const user = {
      email: 'test@example.com',
      password: 'password123',
    };

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText('Type email');
    const passwordInput = screen.getByPlaceholderText('Type password');
    const loginButton = screen.getByText('Login');

    fireEvent.change(emailInput, { target: { value: user.email } });
    fireEvent.change(passwordInput, { target: { value: user.password } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      // You may need to adjust this selector based on your actual implementation
      const homePageTitle = screen.getByText('Welcome to Your App');
      expect(homePageTitle).toBeInTheDocument();
    });
  });

  it('handles login with incorrect credentials', async () => {
    server.use(
      rest.post('http://localhost:5000/auth/login', (req, res, ctx) => {
        return res(ctx.status(404));
      })
    );

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>
    );

    const emailInput = screen.getByPlaceholderText('Type email');
    const passwordInput = screen.getByPlaceholderText('Type password');
    const loginButton = screen.getByText('Login');

    fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      const errorMessage = screen.getByText('Wrong credentials! Try different ones.');
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
