import "./App.css";
import React, { useState, useContext } from "react";
import {
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";

import Navbar            from "./components/Navbar";
import Home              from "./pages/Home";
import Footer            from "./components/Footer";
import Inventory         from "./pages/Inventory";
import SignUp            from "./pages/SignUp";
import Login             from "./pages/Login";
import ECOProgress       from "./pages/ECOProgress";
import Waste             from "./pages/Waste";
import RecipeSearch      from "./pages/RecipeSearch";
import NutritionAnalysis from "./pages/NutritionAnalysis";
import NourishInitiative from "./pages/NourishInitiative";
import Display           from "./pages/Display";
import Profile           from "./pages/Profile";
import FindRecipients    from "./pages/FindRecipients";   // ← NEW

import { AuthProvider, AuthContext } from "./AuthContext";

/* ── Redirects to /login if not logged in ── */
function PrivateRoute({ element }) {
  const { loggedIn } = useContext(AuthContext);
  return loggedIn ? element : <Navigate to="/login" replace />;
}

/* ── App shell — hides Navbar/Footer on auth pages ── */
function Layout() {
  const location = useLocation();

  const hideLayout =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  const [wasteData, setWasteData] = useState([]);

  const addNewWaste = (newWaste) => {
    setWasteData((prevData) => [newWaste, ...prevData]);
  };

  return (
    <>
      {!hideLayout && <Navbar />}

      <Routes>
        {/* ── Public routes ── */}
        <Route path="/"              element={<Home />} />
        <Route path="/signup"        element={<SignUp />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/recipeSearch"  element={<RecipeSearch />} />
        <Route path="/nutriAnalysis" element={<NutritionAnalysis />} />
        <Route path="/nourish"       element={<NourishInitiative />} />
        <Route path="/ecopro"        element={<ECOProgress />} />
        <Route path="/display"       element={<Display newWaste={wasteData} />} />

        {/* ── Private routes (login required) ── */}
        <Route
          path="/inventory"
          element={<PrivateRoute element={<Inventory />} />}
        />
        <Route
          path="/wasteAnalysis"
          element={<PrivateRoute element={<Waste onNewWaste={addNewWaste} />} />}
        />
        <Route
          path="/profile"
          element={<PrivateRoute element={<Profile />} />}
        />
        <Route
          path="/find-recipients"
          element={<PrivateRoute element={<FindRecipients />} />}
        />

        {/* ── 404 → redirect home ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!hideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

export default App;