import { createContext, useContext, useReducer, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("authToken", action.payload.token);
      return { user: action.payload.user, token: action.payload.token };
    case "LOGOUT":
      localStorage.removeItem("authToken");
      return { user: null, token: null };
    case "SET_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: localStorage.getItem("authToken"),
  });

  useEffect(() => {
    if (state.token) {
      api
        .get("/user/me")
        .then((res) => dispatch({ type: "SET_USER", payload: res.data.user }))
        .catch(() => dispatch({ type: "LOGOUT" }));
    }
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);