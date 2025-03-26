"use client";

import React from "react";
import { Bell } from "lucide-react";

const TopNavigation: React.FC = () => {
  return (
    <div className="bg-white shadow z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="sm:ml-6 flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Patient Dashboard
              </h1>
            </div>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <Bell className="h-6 w-6" />
            </button>
            <div className="ml-4 relative flex-shrink-0">
              <div className="rounded-full h-8 w-8 bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">SM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;
