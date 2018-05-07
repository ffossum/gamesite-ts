import React from "react";
import { loginRequest } from "./loginActions";
import LoginFormContainer, { mapDispatchToProps, mapStateToProps } from "./LoginFormContainer";

import { mount } from "enzyme";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { rootReducer } from "../root";

describe("login form container", () => {
  test("is a renderable React component", () => {
    const store = createStore(rootReducer);
    const rendered = mount(
      <Provider store={store}>
        <LoginFormContainer />
      </Provider>
    );

    expect(rendered).toMatchSnapshot();
  });

  describe("mapStateToProps", () => {
    test("selects loading state", () => {
      const store = createStore(rootReducer);
      expect(mapStateToProps(store.getState()).loading).toBe(false);

      store.dispatch(loginRequest({ email: "asdf@asdf.com", password: "asdfasdf" }));
      expect(mapStateToProps(store.getState()).loading).toBe(true);
    });
  });

  describe("mapDispatchToProps", () => {
    test("logIn dispatches loginRequest action", () => {
      const dispatch = jest.fn();
      const props = mapDispatchToProps(dispatch);
      props.logIn({
        email: "qwer@qwer.com",
        password: "qwerqwer",
      });

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith(
        loginRequest({
          email: "qwer@qwer.com",
          password: "qwerqwer",
        })
      );
    });
  });
});
