import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import { setupInterceptors } from './lib/axios-instance';
import store from './store';
import { logout, setAuthState } from './features/auth';
import './index.css';

setupInterceptors({
  dispatch: store.dispatch,
  getState: store.getState,
  logoutAction: logout,
  setAuthStateAction: setAuthState,
});

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Provider store={store}>
        <Toaster position="bottom-center" />
        <Router>
          <App />
        </Router>
      </Provider>
    </StrictMode>
  );
}
