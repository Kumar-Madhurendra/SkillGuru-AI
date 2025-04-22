import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import ThemeProvider from './components/ThemeProvider';
import ChatContainer from './components/ChatContainer';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <div className="min-h-screen w-screen max-w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200 overflow-hidden">
          <ChatContainer />
        </div>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
