'use client';

import React from 'react';
import { SearchResult } from '@/app/ui/friend/searchResultComponent';
import { UserSearchResult } from '@/app/types/user.type';

interface SearchResultListProps {
  searchResults: UserSearchResult[];
  onSendFriendRequest: (userId: string) => void;
  requestLoading: boolean;
  searchTerm: string;
  loading: boolean;
}

export function SearchResultList({ 
  searchResults, 
  onSendFriendRequest, 
  requestLoading,
  searchTerm,
  loading
}: SearchResultListProps) {
  
  if (loading) {
    return (
      <div className="max-h-64 overflow-y-auto">
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <SearchResultSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (searchResults.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-4xl mb-3">🔍</div>
        <p className="text-gray-600 text-lg">'{searchTerm}'에 대한 검색 결과가 없습니다</p>
        <p className="text-gray-500 text-sm mt-1">다른 검색어를 시도해보세요</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-700">
          검색 결과 ({searchResults.length}개)
        </h4>
        <span className="text-xs text-gray-500">'{searchTerm}'</span>
      </div>
      
      {/* 스크롤 가능한 검색 결과 리스트 */}
      <div className="max-h-64 overflow-y-auto pr-2 space-y-3">
        {searchResults.map((user, index) => (
          <SearchResult
            key={String(user.userId)}
            searchResult={user}
            onSendFriendRequest={onSendFriendRequest}
            requestLoading={requestLoading}
            index={index}
          />
        ))}
      </div>
      
      {searchResults.length >= 5 && (
        <div className="text-center pt-2 border-t">
          <p className="text-xs text-gray-500">
            더 정확한 검색을 위해 구체적인 아이디를 입력해보세요
          </p>
        </div>
      )}
    </div>
  );
}

// 스켈레톤 로딩 컴포넌트
function SearchResultSkeleton() {
  return (
    <div className="p-4 bg-gray-50 rounded-lg border animate-pulse">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-32 mb-1"></div>
          <div className="h-2 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
      <div className="h-8 bg-gray-200 rounded"></div>
    </div>
  );
}