import { Routes, Route } from "react-router";
import { MainLayout } from "./MainLayout.jsx";
import { AllImages } from "./images/AllImages.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { UploadPage } from "./UploadPage.jsx";
import { LoginPage } from "./LoginPage.jsx";
import { VALID_ROUTES } from "../src/shared/ValidRoutes.js"; // Adjust path if needed

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Use the shared object values here */}
        <Route path={VALID_ROUTES.HOME} element={<AllImages />} />
        <Route path={VALID_ROUTES.UPLOAD} element={<UploadPage />} />
        <Route path={VALID_ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={VALID_ROUTES.IMAGE_DETAILS} element={<ImageDetails />} />
      </Route>
    </Routes>
  );
}

export default App;
