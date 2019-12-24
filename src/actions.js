import palace from "./api/palace";

const loginBegins = () => ({
  type: "LOGIN_LOADING"
});

const loginFailed = error => ({
  type: "LOGIN_FAILED",
  error
});

const loginCompleted = result => ({
  type: "LOGIN_COMPLETED",
  payload: {
    result
  }
});

const login = () => {
  return async (dispatch, getState) => {
    dispatch(loginBegins());

    const result = await palace().login();

    if (result) {
      dispatch(loginCompleted(result));
    } else {
      dispatch(loginFailed(result));
    }
  };
};

const initialState = { isLoading: false, isAuthenticated: false };

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_LOADING":
      return { ...state, isLoading: true };
    
    case "LOGIN_COMPLETED":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: action.payload.result
      };
  
    case "LOGIN_FAILED":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        error: action.error
      };
  }

  return state;
};

export { login };
export default loginReducer;
