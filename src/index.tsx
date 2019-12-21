import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App';
import { configureStore, injectReducer, buildNameSpace } from './store';

const store = configureStore();
console.log(store);

const recipes = [
  { key: 'firstName', initialValue: 'John' },
  { key: 'lastName', initialValue: 'Doe' }
];

const personalData = buildNameSpace({ recipes, namespace: 'personalData' });
injectReducer(store, 'personalData', personalData.reducer);

const actionSequence = [personalData.actions.firstName.set('Jimmy'), personalData.actions.lastName.set('Green')];
store.dispatch(actionSequence);
console.log(personalData.selectors.firstName.get(store.getState()));

ReactDOM.render(<App appName="My App" />, document.querySelector('#app'));
