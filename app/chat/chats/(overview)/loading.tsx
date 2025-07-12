export default function Loading() {
  return (
    <div className="p-6">
      {/* 로딩 스켈레톤 */}
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div className="flex items-center p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-200 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 flex-shrink-0 relative">
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-300 rounded-full"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-8 ml-2"></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                    <div className="h-4 w-5 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="flex items-center justify-between">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}