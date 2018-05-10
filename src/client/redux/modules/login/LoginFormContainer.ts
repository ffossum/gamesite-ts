import { connect, Dispatch } from "react-redux";
import RegistrationForm from "../../../components/login/LoginForm";
import { Action } from "../../actions";
import { State } from "../root";
import { loginRequest } from "./loginActions";
import { Login } from "./loginActions";

export function mapStateToProps(state: State) {
  return {
    loading: state.login.loading,
  };
}

export function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    logIn(login: Login) {
      dispatch(loginRequest(login));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm);
