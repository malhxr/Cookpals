import {
  SAVE_NOTIFICATION,
  SAVE_USER_LOGGEDIN,
  SAVE_USER_TOKEN,
  SAVE_POST
} from "../Actions/User";

const InitialState = {
  isLoggedIn: false,
  detail: {},
  notification: [],
};

export function userOperation(state = InitialState, { type, ...rest }) {
  switch (type) {
    case SAVE_USER_LOGGEDIN: {
      return { ...state, ...rest };
    }
    case SAVE_USER_TOKEN: {
      return { ...state, ...rest };
    }
    case SAVE_NOTIFICATION: {
      return { ...state, ...rest };
    }
    case SAVE_POST: {
      return { ...state, ...rest };
    }
    default:
      return state;
  }
}
