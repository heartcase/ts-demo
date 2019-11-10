import { configureStore } from "../store";

describe("Test configureStore()", () => {
  it("should call window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__", () => {
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
});
