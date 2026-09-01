import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
// import { put, takeLatest } from "redux-saga/effects";
import { getUserByToken } from "./authCrud";
import { put, takeLatest, call } from "redux-saga/effects"; // Import call from redux-saga/effects

export const actionTypes = {
  Login: "[Login] Action",
  Logout: "[Logout] Action",
  Register: "[Register] Action",
  UserRequested: "[Request User] Action",
  UserLoaded: "[Load User] Auth API"
};

const initialAuthState = {
  user: undefined,
  authToken: undefined,
  role: undefined // Add the role property
};

export const reducer = persistReducer(
  { storage, key: "v706-demo1-auth", whitelist: ["user", "authToken"] },
  (state = initialAuthState, action) => {
    switch (action.type) {
      case actionTypes.Login: {
        const { authToken } = action.payload;
        return { authToken, user: undefined };
      }

      case actionTypes.Register: {
        const { authToken } = action.payload;
        return { authToken, user: undefined };
      }

      case actionTypes.Logout: {
        // TODO: Change this code. Actions in reducer aren't allowed.
        return initialAuthState;
      }

      case actionTypes.UserLoaded: {
        const { user } = action.payload;
        console.log("UserLoaded action:", user); // Added this line for debugging
        console.log("User role:", user.user.role); // Log the role
        return { ...state, user,role: user.role }; //to get the role
      }

      default:
        return state;
    }
  }
);

export const actions = {
  login: authToken => ({ type: actionTypes.Login, payload: { authToken } }),
  register: authToken => ({
    type: actionTypes.Register,
    payload: { authToken }
  }),
  logout: () => ({ type: actionTypes.Logout }),
  requestUser: user => ({ type: actionTypes.UserRequested, payload: { user } }),
  fulfillUser: user => ({ type: actionTypes.UserLoaded, payload: { user } })
};

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga() {
    yield put(actions.requestUser());
  });

  yield takeLatest(actionTypes.Register, function* registerSaga() {
    yield put(actions.requestUser());
  });

  // yield takeLatest(actionTypes.UserRequested, function* userRequested() {
  //   const { data: user } = yield getUserByToken();

  //   yield put(actions.fulfillUser(user));
  // });

  yield takeLatest(actionTypes.UserRequested, function* userRequested() {
    try {
      const user = yield call(getUserByToken);
      yield put(actions.fulfillUser(user));
    } catch (error) {
      // Handle any errors here, e.g., by logging or dispatching an error action
      console.error("Error loading user:", error);
    }
  });
}