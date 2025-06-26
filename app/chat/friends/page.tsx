'use client'; // This directive marks the component as a Client Component in Next.js App Router

import React from 'react';

// Friends List Page Component
export default async function Page() {
  return (
    // Main container for the friends list content
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">친구 목록</h2>
      <div className="space-y-3">
        {/* Example Friend 1 */}
        <div className="flex items-center p-3 bg-gray-100 rounded-lg shadow-sm">
          <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-800 font-semibold mr-3">JD</div>
          <div>
            <p className="text-md font-semibold text-gray-800">John Doe</p>
            <p className="text-sm text-gray-500">온라인</p>
          </div>
        </div>
        {/* Example Friend 2 */}
        <div className="flex items-center p-3 bg-gray-100 rounded-lg shadow-sm">
          <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-semibold mr-3">JS</div>
          <div>
            <p className="text-md font-semibold text-gray-800">Jane Smith</p>
            <p className="text-sm text-gray-500">오프라인</p>
          </div>
        </div>
        {/* Example Friend 3 */}
        <div className="flex items-center p-3 bg-gray-100 rounded-lg shadow-sm">
          <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center text-purple-800 font-semibold mr-3">KP</div>
          <div>
            <p className="text-md font-semibold text-gray-800">Kim Parker</p>
            <p className="text-sm text-gray-500">온라인</p>
          </div>
        </div>
        {/* You can add more friends here */}
      </div>
    </div>
  );
};
