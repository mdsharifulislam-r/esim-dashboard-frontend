import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { store } from './store';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#009A54',
            colorLink: '#009A54',
            colorSuccess: '#009A54',
            borderRadius: 8,
            fontFamily: "'DM Sans', sans-serif",
          },
          components: {
            Button: { colorPrimary: '#009A54' },
            Switch: { colorPrimary: '#009A54' },
            Pagination: { colorPrimary: '#009A54' },
            Menu: { colorItemBgSelected: '#e6f7ef', colorItemTextSelected: '#009A54' },
          },
        }}
      >
        <App />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);
