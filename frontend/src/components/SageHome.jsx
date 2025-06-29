import React, { useState } from "react";

const menuData = {
  Sales: {
    Prices: [
      "Price Search",
      "Price Entry",
      "Generate Price Catalogs",
      "Price Update Definition",
      "Price Update",
    ],
    Quotes: ["Quote Entry", "Quote Approval", "Quote History"],
    Orders: ["Order Entry", "Order Tracking", "Order History"],
    Allocations: ["Allocation Entry", "Allocation Reports"],
    "Shipment preparation": ["Prepare Shipment", "Shipment Labels"],
    Shipments: ["Shipment Confirmation", "Shipment Tracking"],
    Invoices: ["Invoice Entry", "Invoice Search", "Invoice Reports"],
    Returns: ["Return Entry", "Return Tracking"],
    Enquiries: ["Sales Enquiry", "Stock Enquiry"],
    Utilities: ["Sales Utilities", "Reports", "Settings"],
  },
};

export default function MenuInterface() {
  const [activeTopMenu, setActiveTopMenu] = useState("Sales");
  const [activeLeftMenu, setActiveLeftMenu] = useState("Prices");

  const leftMenuItems = Object.keys(menuData[activeTopMenu] || {});
  const rightMenuItems = menuData[activeTopMenu]?.[activeLeftMenu] || [];

  const topTabs = [
    "Administration", "Development", "Parameters", "Common Data",
    "Customer Relation", "Projects", "Purchasing", "Sales",
    "Inventory", "Manufacturing", "Change Control", "Costing",
    "Financials", "More..."
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Top bar */}
      <header className="bg-gray-800 text-white flex items-center px-6 h-12 space-x-4">
        <div className="text-lg font-bold flex items-center space-x-2">
          <span className="bg-white text-gray-900 px-2 py-1 rounded-sm">sage</span>
          <span>Enterprise Management</span>
        </div>
        <nav className="flex space-x-6 ml-6">
          {topTabs.map((tab) => (
            <button
              key={tab}
              className={`relative px-3 py-1 font-medium hover:bg-gray-700 rounded ${
                tab === activeTopMenu
                  ? "border-b-2 border-white text-white"
                  : "text-gray-300"
              }`}
              onClick={() => {
                setActiveTopMenu(tab);
                if (tab === "Sales") {
                  setActiveLeftMenu("Prices");
                } else {
                  setActiveLeftMenu(null);
                }
              }}
            >
              {tab}
            </button>
          ))}
        </nav>
        <div className="ml-auto flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm">
            A
          </div>
          <span className="text-sm">Abdulhamid Aminu</span>
          <span className="text-xs bg-green-600 rounded px-1">Albabello Live</span>
          <button title="Home" className="text-gray-300 hover:text-white">🏠</button>
          <button title="Star" className="text-gray-300 hover:text-white">⭐</button>
          <button title="Reports" className="text-gray-300 hover:text-white">📄</button>
          <button title="Help" className="text-gray-300 hover:text-white">?</button>
          <button title="Search" className="text-gray-300 hover:text-white">🔍</button>
        </div>
      </header>

      {/* Dropdown submenu for Sales */}
      {activeTopMenu === "Sales" && (
        <div className="bg-white shadow-md flex border-t border-gray-300 min-h-[250px]">
          {/* Left vertical menu */}
          <div className="w-48 border-r border-gray-300 bg-gray-50">
            {leftMenuItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveLeftMenu(item)}
                className={`flex justify-between items-center w-full px-4 py-2 text-left text-sm border-b border-gray-200 hover:bg-gray-200 ${
                  item === activeLeftMenu
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-gray-700"
                }`}
              >
                {item}
                <span className="text-xs">&#8250;</span>
              </button>
            ))}
          </div>

          {/* Right submenu area */}
          <div className="flex-1 p-4 text-sm text-gray-700 border-l border-gray-300">
            {rightMenuItems.map((subItem) => (
              <div
                key={subItem}
                className="mb-2 hover:text-blue-600 cursor-pointer"
              >
                {subItem}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
