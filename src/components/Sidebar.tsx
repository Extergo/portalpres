"use client";

import React from "react";
import { Activity, Users, Calendar, FileText, Settings } from "lucide-react";

const Sidebar: React.FC = () => {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-semibold tracking-tight text-gray-900">
              Pulse Portal
            </span>
          </div>
        </div>
        <div className="mt-8 flex flex-col flex-1">
          <nav className="flex-1 px-2 space-y-1 bg-white">
            <div className="px-3 py-2 bg-blue-50 text-blue-700 rounded-md flex items-center space-x-3">
              <Users className="h-5 w-5" />
              <span className="font-medium">Patients</span>
            </div>
            <div className="px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md flex items-center space-x-3">
              <Calendar className="h-5 w-5" />
              <span>Appointments</span>
            </div>
            <div className="px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md flex items-center space-x-3">
              <FileText className="h-5 w-5" />
              <span>Medical Records</span>
            </div>
            <div className="px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md flex items-center space-x-3">
              <Activity className="h-5 w-5" />
              <span>Analytics</span>
            </div>
            <div className="px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md flex items-center space-x-3">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </div>
          </nav>
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center">
            <img
              src="/api/placeholder/40/40"
              alt="Profile"
              className="h-10 w-10 rounded-full"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                Dr. Sarah Miller
              </p>
              <p className="text-xs font-medium text-gray-500">
                General Practitioner
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
