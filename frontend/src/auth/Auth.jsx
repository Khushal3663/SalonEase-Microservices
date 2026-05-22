import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { Alert, Button, Snackbar } from "@mui/material";
import { useSelector } from "react-redux";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { error } = useSelector((state) => state.auth);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error) setShowError(true);
  }, [error]);

  return (
    <>
      <div className="flex justify-center items-center h-[95vh]">
        <div className="shadow-lg p-5 lg:w-1/4 sm:w-1/2 py-10">
          {location.pathname === "/register" ? (
            <div>
              <SignupForm />
              <div className="text-center pt-3">
                Already Have Account ?{" "}
                <Button onClick={() => navigate("/login")}>Login</Button>
              </div>
            </div>
          ) : (
            <div>
              <LoginForm />
              <div className="text-center pt-3">
                Not Have Account ?{" "}
                <Button onClick={() => navigate("/register")}>Signup</Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Auth;
