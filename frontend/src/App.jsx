import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router"; // Added useNavigate
import { MainLayout } from "./MainLayout.jsx";
import { AllImages } from "./images/AllImages.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { UploadPage } from "./UploadPage.jsx";
import { LoginPage } from "./LoginPage.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { VALID_ROUTES } from "../src/shared/ValidRoutes.js";

function App() {
  const [authToken, setAuthToken] = useState(null);
  const navigate = useNavigate();

  // 1. Create a logout handler
  const handleLogout = () => {
    setAuthToken(null);
    navigate(VALID_ROUTES.LOGIN); // Send them back to login
  };

  return (
    <Routes>
      {/* 2. Pass handleLogout and the token to the Layout so it can show/hide the button */}
      <Route
        element={<MainLayout authToken={authToken} onLogout={handleLogout} />}
      >
        <Route
          path={VALID_ROUTES.HOME}
          element={
            <ProtectedRoute authToken={authToken}>
              <AllImages authToken={authToken} />
            </ProtectedRoute>
          }
        />
        <Route
          path={VALID_ROUTES.UPLOAD}
          element={
            <ProtectedRoute authToken={authToken}>
              <UploadPage authToken={authToken} />
            </ProtectedRoute>
          }
        />
        <Route
          path={VALID_ROUTES.IMAGE_DETAILS}
          element={
            <ProtectedRoute authToken={authToken}>
              <ImageDetails authToken={authToken} />
            </ProtectedRoute>
          }
        />

        <Route
          path={VALID_ROUTES.LOGIN}
          element={<LoginPage setAuthToken={setAuthToken} />}
        />
        <Route
          path={VALID_ROUTES.REGISTER}
          element={
            <LoginPage isRegistering={true} setAuthToken={setAuthToken} />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
