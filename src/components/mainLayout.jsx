import { Outlet } from "react-router-dom";
import Header from "../components/header.jsx";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto px-4 py-10 w-full">
        <Outlet />
      </main>
    </div>
  );
}