'use client';

import React, { useState } from 'react';
import { SearchResultList } from '@/app/ui/friend/searchListComponent';
import { UserSearchResult } from '@/app/types/user.type';

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchFriend: (searchId: string) => Promise<UserSearchResult[]>;
  onSendFriendRequest: (userId: string) => Promise<{ success: boolean; error?: string }>;
  loading?: boolean;
}

export function AddFriendModal({
  isOpen,
  onClose,
  onSearchFriend,
  onSendFriendRequest,
  loading = false
}: AddFriendModalProps) {
  const [friendSearchId, setFriendSearchId] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false); // 검색이 완료되었는지 여부

  if (!isOpen) return null;

  const handleSearchFriend = async () => {
    if (friendSearchId.trim() === '') {
      setError('아이디를 입력해주세요.');
      return;
    }
    
    if (friendSearchId.trim().length <= 2) {
      setError('최소 3글자 이상 입력해주세요.');
      return;
    }
    
    try {
      setSearchLoading(true);
      setError(null);
      setSearchResults([]);
      setHasSearched(false);
      
      const results = await onSearchFriend(friendSearchId.trim());
      setSearchResults(results || []);
      setHasSearched(true);
      
    } catch (err) {
      setError('검색 중 오류가 발생했습니다.');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    try {
      setRequestLoading(true);
      setError(null);
      
      const result = await onSendFriendRequest(userId);
      
      if (result.success) {
        // 성공 시 해당 사용자의 상태 업데이트
        setSearchResults(prev => 
          prev.map(user => 
            user.userId === userId 
              ? { ...user, requested: 'REQUESTED' }
              : user
          )
        );
        
        
      } else {
        setError(result.error || '친구 요청 전송에 실패했습니다.');
      }
    } catch (err) {
      setError('친구 요청 전송 중 오류가 발생했습니다.');
    } finally {
      setRequestLoading(false);
    }
  };

  const handleClose = () => {
    setFriendSearchId('');
    setSearchResults([]);
    setError(null);
    setHasSearched(false);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !searchLoading) {
      handleSearchFriend();
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.50)' }}
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <h3 className="text-2xl font-bold text-gray-800">친구 추가</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-light leading-none transition-colors"
            aria-label="모달 닫기"
          >
            &times;
          </button>
        </div>

        {/* 컨텐츠 (스크롤 가능) */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* 검색 영역 */}
          <div className="p-6 flex-shrink-0">
            <div>
              <label 
                htmlFor="friendIdSearch" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                친구 아이디 검색
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="friendIdSearch"
                  value={friendSearchId}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-800 transition-colors"
                  placeholder="친구 아이디를 입력하세요 (최소 3글자)"
                  onChange={(e) => setFriendSearchId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={searchLoading}
                  autoComplete="off"
                  maxLength={20}
                />
                <button
                  onClick={handleSearchFriend}
                  disabled={searchLoading || friendSearchId.trim().length < 2}
                  className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
                >
                  {searchLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                      검색
                    </div>
                  ) : (
                    '검색'
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                최소 3글자를 입력해주세요. 친구 아이디로 검색할 수 있습니다.
              </p>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* 검색 결과 (스크롤 가능) */}
          {(hasSearched || searchLoading) && (
            <div className="flex-1 overflow-hidden px-6">
              <SearchResultList
                searchResults={searchResults}
                onSendFriendRequest={handleSendRequest}
                requestLoading={requestLoading}
                searchTerm={friendSearchId}
                loading={searchLoading}
              />
            </div>
          )}

          {/* 닫기 버튼 */}
          <div className="p-6 border-t flex-shrink-0">
            <button
              onClick={handleClose}
              className="w-full px-4 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}