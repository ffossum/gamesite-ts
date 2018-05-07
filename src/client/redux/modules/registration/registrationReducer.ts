import { Action } from "../../actions";
import {
  REGISTRATION_FAILURE,
  REGISTRATION_REQUEST,
  REGISTRATION_SUCCESS,
} from "./registrationActions";

export interface RegistrationState {
  loading: boolean;
}
const initialState = {
  loading: false,
};
export default function reducer(state: RegistrationState = initialState, action: Action) {
  switch (action.type) {
    case REGISTRATION_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }

    case REGISTRATION_SUCCESS:
    case REGISTRATION_FAILURE: {
      return {
        ...state,
        loading: false,
      };
    }

    default:
      return state;
  }
}
