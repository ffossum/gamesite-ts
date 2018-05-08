/* @flow */
import { applyMiddleware, compose, createStore } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { rootEpic, rootReducer } from "./modules/root";
import { State } from "./modules/root";
import { Dependencies } from "./modules/root";

export default function configureStore(
  preloadedState: State | undefined,
  dependencies: Dependencies
) {
  const composeEnhancers = dependencies.devToolsCompose || compose;

  const epicMiddleware = createEpicMiddleware(rootEpic, {
    dependencies,
  });

  const storeEnhancer = composeEnhancers(applyMiddleware(epicMiddleware));

  if (preloadedState) {
    return createStore(rootReducer, preloadedState, storeEnhancer);
  }

  return createStore(rootReducer, storeEnhancer);
}
