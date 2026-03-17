import React, { useActionState } from "react";
import { Link, useNavigate } from "react-router";
import "./LoginPage.css";

export function LoginPage({ isRegistering, setAuthToken }) {
  // 1. Initialize the navigate hook
  const navigate = useNavigate();

  const usernameInputId = React.useId();
  const passwordInputId = React.useId();
  const emailInputId = React.useId();

  const [actionState, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const username = formData.get("username");
      const password = formData.get("password");
      const email = formData.get("email");

      const url = isRegistering ? "/api/users" : "/api/auth/tokens";
      const requestBody = isRegistering
        ? { username, email, password }
        : { username, password };

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json();
          return {
            error: errorData.message || "An error occurred. Please try again.",
          };
        }

        const data = await response.json();

        // 2. Save the token to App.jsx state
        setAuthToken(data.token);

        // 3. Redirect the user to the homepage!
        navigate("/");

        return { success: true };
      } catch (err) {
        console.error("Network or server error:", err);
        return { error: "Could not connect to the server." };
      }
    },
    null,
  );

  return (
    <>
      <h2>{isRegistering ? "Register a new account" : "Login"}</h2>

      <form className="LoginPage-form" action={submitAction}>
        {/* Display errors in an aria-live container */}
        {actionState?.error && (
          <div
            aria-live="polite"
            className="error-message"
            style={{ color: "red", marginBottom: "1rem" }}
          >
            {actionState.error}
          </div>
        )}

        <label htmlFor={usernameInputId}>Username</label>
        <input
          id={usernameInputId}
          name="username"
          required
          disabled={isPending}
        />

        {isRegistering && (
          <>
            <label htmlFor={emailInputId}>Email</label>
            <input
              id={emailInputId}
              name="email"
              type="email"
              required
              disabled={isPending}
            />
          </>
        )}

        <label htmlFor={passwordInputId}>Password</label>
        <input
          id={passwordInputId}
          name="password"
          type="password"
          required
          disabled={isPending}
        />

        <input
          type="submit"
          value={
            isPending ? "Loading..." : isRegistering ? "Register" : "Login"
          }
          disabled={isPending}
        />
      </form>

      <div style={{ marginTop: "1rem" }}>
        {isRegistering ? (
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        ) : (
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        )}
      </div>
    </>
  );
}
