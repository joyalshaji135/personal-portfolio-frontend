// DocRouter.jsx - Optional, can be removed if all routes are in DevDoc
import { Routes, Route, Navigate } from "react-router-dom";
import DevDoc from './DevDoc';

const DeveloperDoc = () => {
  return (
    <Routes>
      {/* All routes are handled in DevDoc component */}
      <Route path="/*" element={<DevDoc />} />
    </Routes>
  );
};

export default DeveloperDoc;