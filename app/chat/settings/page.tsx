'use client';

import React from 'react';

// Tailwind CSS CDN을 로드합니다.
// 실제 Next.js 프로젝트에서는 tailwind.config.js를 통해 설정합니다.
// 이 코드는 단일 파일에서 실행될 수 있도록 CDN을 포함합니다.
const TailwindCDN = () => (
  <script src="https://cdn.tailwindcss.com"></script>
);

// 헤더 컴포넌트: 로고, 상단 메뉴 등을 포함합니다.
const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        {/* 로고 영역 */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-green-600">
            <a href="#" className="hover:text-green-700">MyNaver</a>
          </h1>
          <nav className="ml-8 hidden md:flex space-x-6 text-gray-700 text-sm">
            <a href="#" className="hover:text-green-600">메일</a>
            <a href="#" className="hover:text-green-600">카페</a>
            <a href="#" className="hover:text-green-600">블로그</a>
            <a href="#" className="hover:text-green-600">쇼핑</a>
            <a href="#" className="hover:text-green-600">뉴스</a>
          </nav>
        </div>
        {/* 우측 상단 메뉴 */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <a href="#" className="hover:text-green-600">로그인</a>
          <a href="#" className="hover:text-green-600">회원가입</a>
        </div>
      </div>
    </header>
  );
};

// 검색창 컴포넌트: 중앙 검색 입력 필드와 버튼을 포함합니다.
const SearchBar = () => {
  return (
    <div className="flex justify-center my-8 md:my-12">
      <div className="w-full max-w-xl flex border border-green-500 rounded-full overflow-hidden shadow-md">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          className="flex-grow p-3 pl-6 text-lg focus:outline-none focus:ring-2 focus:ring-green-300 rounded-l-full"
        />
        <button className="bg-green-500 text-white px-6 py-3 text-lg font-semibold rounded-r-full hover:bg-green-600 transition-colors duration-200">
          검색
        </button>
      </div>
    </div>
  );
};

// 뉴스 섹션 컴포넌트: 최신 뉴스 기사 목록을 표시합니다.
const NewsSection = () => {
  const newsItems = [
    { id: 1, title: "오늘의 주요 뉴스 헤드라인입니다.", source: "연합뉴스" },
    { id: 2, title: "경제 동향 분석: 주식 시장의 변화", source: "매일경제" },
    { id: 3, title: "날씨 소식: 전국적으로 맑은 날씨 예상", source: "기상청" },
    { id: 4, title: "스포츠 하이라이트: 어제 경기 결과", source: "스포츠조선" },
  ];

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">뉴스</h2>
      <ul>
        {newsItems.map((news) => (
          <li key={news.id} className="mb-3 pb-3 border-b border-gray-100 last:mb-0 last:pb-0 last:border-b-0">
            <a href="#" className="text-gray-700 hover:text-green-600 text-base">
              {news.title} <span className="text-gray-500 text-sm">({news.source})</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="text-right mt-4">
        <a href="#" className="text-green-600 hover:underline text-sm">더보기 &gt;</a>
      </div>
    </section>
  );
};

// 쇼핑 섹션 컴포넌트: 인기 상품 목록을 그리드 형태로 표시합니다.
const ShoppingSection = () => {
  const products = [
    { id: 1, name: "최신 스마트폰", price: "1,200,000원", imageUrl: "https://placehold.co/150x150/E0F2F1/000?text=상품1" },
    { id: 2, name: "무선 이어폰", price: "150,000원", imageUrl: "https://placehold.co/150x150/E0F2F1/000?text=상품2" },
    { id: 3, name: "게이밍 노트북", price: "2,000,000원", imageUrl: "https://placehold.co/150x150/E0F2F1/000?text=상품3" },
    { id: 4, name: "스마트 워치", price: "300,000원", imageUrl: "https://placehold.co/150x150/E0F2F1/000?text=상품4" },
  ];

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800">쇼핑</h2>
      <div className="grid grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col items-center text-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-auto rounded-md mb-2 object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/150x150/E0F2F1/000?text=이미지없음" }}
            />
            <p className="text-sm font-medium text-gray-700">{product.name}</p>
            <p className="text-sm text-green-600 font-bold">{product.price}</p>
          </div>
        ))}
      </div>
      <div className="text-right mt-4">
        <a href="#" className="text-green-600 hover:underline text-sm">더보기 &gt;</a>
      </div>
    </section>
  );
};

// 서비스 섹션 컴포넌트: 다양한 서비스 아이콘/링크를 표시합니다.
const ServicesSection = () => {
  const services = [
    { name: "웹툰", icon: "📚" },
    { name: "지도", icon: "🗺️" },
    { name: "사전", icon: "📖" },
    { name: "부동산", icon: "🏠" },
    { name: "증권", icon: "📈" },
    { name: "VOD", icon: "📺" },
    { name: "예약", icon: "📅" },
    { name: "페이", icon: "💳" },
  ];

  return (
    <section className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">주요 서비스</h2>
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4 text-center">
        {services.map((service) => (
          <a key={service.name} href="#" className="flex flex-col items-center p-2 rounded-md hover:bg-gray-50 transition-colors duration-200">
            <span className="text-3xl mb-1">{service.icon}</span>
            <span className="text-sm text-gray-700">{service.name}</span>
          </a>
        ))}
      </div>
    </section>
  );
};

// 메인 App 컴포넌트
const App = () => {
  return (
    <>
      <TailwindCDN /> {/* Tailwind CSS CDN 로드 */}
      {/* 뷰포트 메타 태그: 반응형 웹을 위해 필수 */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {/* Inter 폰트 로드 (Tailwind 기본 폰트) */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />

      <div className="min-h-screen bg-gray-100 font-inter antialiased">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <SearchBar />
          {/* 주요 콘텐츠 영역: 뉴스 섹션과 쇼핑 섹션을 그리드 형태로 배치 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {/* 뉴스 섹션은 더 넓은 공간을 차지하도록 md:col-span-2 적용 */}
            <div className="md:col-span-2">
              <NewsSection />
            </div>
            {/* 쇼핑 섹션 */}
            <div className="md:col-span-1">
              <ShoppingSection />
            </div>
          </div>
          {/* 주요 서비스 섹션 */}
          <ServicesSection />
        </main>
      </div>
    </>
  );
};

export default App;
