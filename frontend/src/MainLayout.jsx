import { Outlet, Link } from "react-router";
import { VALID_ROUTES } from "../src/shared/ValidRoutes.js";

export function MainLayout({ authToken, onLogout }) {
  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem",
          background: "#f4f4f4",
        }}
      >
        <nav>
          <Link to={VALID_ROUTES.HOME}>Home</Link> |{" "}
          <Link to={VALID_ROUTES.UPLOAD}>Upload</Link>
        </nav>

        {/* 3. Only show the Logout button if we have a token */}
        {authToken && (
          <button onClick={onLogout} style={{ cursor: "pointer" }}>
            Logout
          </button>
        )}
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
