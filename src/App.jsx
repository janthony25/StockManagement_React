import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { ArrowLeftFromLine, ArrowRightFromLine, ChartNoAxesCombined, NotepadText } from "lucide-react";
import Dashboard from "./components/pages/Dashboard";
import StocksPage from "./components/pages/StocksPage";

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
        <div style={{ display: "flex", height: "100vh" }}>
              {/* Sidebar */}
              <Sidebar collapsed={collapsed} style={{ backgroundColor: "#333", color: "" }}>
                <Menu>
                <MenuItem onClick={() => setCollapsed(!collapsed)}>
                    {collapsed ? <ArrowRightFromLine /> : <ArrowLeftFromLine />}
                  </MenuItem>
                  <MenuItem component={<Link to="/" />}>
                    {collapsed ? <ChartNoAxesCombined /> : "Dashboard"}
                  </MenuItem>
                  <MenuItem component={<Link to="/stocks" />}>  
                    {collapsed ? <NotepadText /> : "Stocks"}
                  </MenuItem>
                  <SubMenu label="Charts">
                    <MenuItem>Pie charts</MenuItem>
                    <MenuItem>Line charts</MenuItem>
                  </SubMenu>
                </Menu>
              </Sidebar>

              {/* Main Content */}
              <main style={{ padding: "20px", flex: 1 }}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/stocks" element={<StocksPage />} />
                </Routes>
              </main>
        </div>
    </Router>
    
  );
};

export default App;