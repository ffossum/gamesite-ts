import { connect, Dispatch } from "react-redux";
import RegistrationForm from "../../../components/login/LoginForm";
import { State } from "../root";
import { loginRequest } from "./loginActions";
import { Login } from "./loginActions";

export function mapStateToProps(state: State) {
  return {
    loading: state.login.loading,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<State>) {
  return {
    logIn(login: Login) {
      dispatch(loginRequest(login));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm);
