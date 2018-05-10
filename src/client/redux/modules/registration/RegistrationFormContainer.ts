import { connect, Dispatch } from "react-redux";
import RegistrationForm from "../../../components/registration/RegistrationForm";
import { Action } from "../../actions";
import { State } from "../root";
import { Registration, registrationRequest } from "./registrationActions";

export default connect(
  (state: State) => ({
    loading: state.registration.loading,
  }),
  (dispatch: Dispatch<Action>) => ({
    register(registration: Registration) {
      dispatch(registrationRequest(registration));
    },
  })
)(RegistrationForm);
