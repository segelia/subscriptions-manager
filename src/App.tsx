import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import SubscriptionsList from './features/subscriptions/components/SubscriptionsList';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div>
        <SubscriptionsList />
      </div>
    </Provider>
  );
};

export default App;
