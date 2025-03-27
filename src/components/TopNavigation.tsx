"use client";

import React from "react";
import { Bell, User } from "lucide-react";

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
            {/* Add more space on the right to avoid NextJS bubble overlap */}
            <button
              type="button"
              className="p-1 mr-8 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <Bell className="h-6 w-6" />
            </button>
            <div className="relative flex-shrink-0">
              {/* Use the same avatar for consistency */}
              <img
                src="https://avatars.dicebear.com/api/personas/dr-sarah-miller.svg"
                alt="Dr. Sarah Miller"
                className="h-10 w-10 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;
