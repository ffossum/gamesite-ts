import { connect } from "react-redux";
import Nav from "../../../components/nav/Nav";
import { State } from "../root";

export default connect((state: State) => ({
  user: state.session.user,
}))(Nav);
