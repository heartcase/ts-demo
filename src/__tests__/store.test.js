import {
  configureStore,
  combinedActionMiddleware,
  getEmptyObject,
  getIdentity,
  buildNameSpace,
  createState,
  injectReducer
} from '../store';

describe('Test Store', () => {
  test('should call window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__', () => {
    const compose = jest.fn();
    const rootReducer = state => state;
    const preloadedState = {};

    // no redux devtool
    configureStore(rootReducer, preloadedState);

    // has redux devtool
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = compose;
    configureStore(rootReducer, preloadedState);
    expect(compose).toHaveBeenCalled();
  });

  test('test combinedActionMiddleware', () => {
    const store = {
      dispatch: a => a
    };
    const next = a => a;
    const action = { type: 'ACTION_TYPE' };
    const actions = [action];
    const wrapper = combinedActionMiddleware(store)(next);
    expect(wrapper(action)).toEqual(action);
    expect(wrapper(actions)).toEqual(actions);
  });

  test('test helpers', () => {
    const state = {};
    expect(getEmptyObject()).toEqual({});
    expect(getIdentity(state)).toEqual(state);
  });

  test('test configureStore', () => {
    const store = configureStore();
    expect(store.injectedReducers).toEqual({});
    expect(store.injectedSagas).toEqual({});
  });

  test('test createState (without namespace)', () => {
    const { key, actions, reducer, selectors } = createState({
      key: 'test',
      initialValue: 'hello'
    });
    const setAction = { type: 'test.set', value: 'world' };
    const resetAction = { type: 'test.reset' };
    expect(key).toEqual('test');
    expect(actions.set('world')).toEqual(setAction);
    expect(actions.reset()).toEqual(resetAction);
    expect(reducer(undefined, {})).toEqual('hello');
    expect(reducer('hello', setAction)).toEqual('world');
    expect(reducer('world', resetAction)).toEqual('hello');
    expect(selectors.get({ test: 'hello world' })).toEqual('hello world');
  });

  test('test createState (with namespace)', () => {
    const { key, actions, reducer, selectors } = createState({
      key: 'test',
      initialValue: 'hello',
      namespace: 'root'
    });
    const setAction = { type: 'root.test.set', value: 'world' };
    const resetAction = { type: 'root.test.reset' };
    expect(key).toEqual('test');
    expect(actions.set('world')).toEqual(setAction);
    expect(actions.reset()).toEqual(resetAction);
    expect(reducer(undefined, {})).toEqual('hello');
    expect(reducer('hello', setAction)).toEqual('world');
    expect(reducer('world', resetAction)).toEqual('hello');
    expect(selectors.get({ root: { test: 'hello world' } })).toEqual('hello world');
  });

  test('test buildNameSpace', () => {
    const recipes = [
      { key: 'firstName', initialValue: 'John' },
      { key: 'lastName', initialValue: 'Doe' }
    ];
    const { actions, reducer, selectors } = buildNameSpace({ recipes });
    const setAction = { type: 'firstName.set', value: 'Jimmy' };

    expect(actions.firstName.set('Jimmy')).toEqual(setAction);
    expect(reducer(undefined, setAction)).toEqual({
      firstName: 'Jimmy',
      lastName: 'Doe'
    });
    expect(selectors.firstName.get({ firstName: 'Jimmy' })).toEqual('Jimmy');
  });

  test('test injectReducer', () => {
    const recipes = [
      { key: 'firstName', initialValue: 'John' },
      { key: 'lastName', initialValue: 'Doe' }
    ];
    const { reducer } = buildNameSpace({ recipes });
    const store = configureStore();
    injectReducer(store, 'personalData', reducer);
    expect(store.injectedReducers).toEqual({ personalData: reducer });
    store.dispatch({ type: 'firstName.set', value: 'Jimmy' });
    expect(store.getState().personalData.firstName).toEqual('Jimmy');
  });
});
