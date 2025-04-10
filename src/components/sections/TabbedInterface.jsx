import React, { useState, useEffect } from 'react';

const TabbedInterface = ({ title, subtitle, tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  useEffect(() => {
    // Ensure the active tab is valid
    if (!tabs.find(tab => tab.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#2C3E50]">{title}</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#1A7A64] to-[#4ECDC4] rounded-full mx-auto my-4"></div>
          <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed">{subtitle}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex flex-wrap border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`py-4 px-6 font-medium text-gray-600 hover:text-[#1A7A64] focus:outline-none tab-button ${activeTab === tab.id ? 'active-tab' : ''}`}
                onClick={() => handleTabClick(tab.id)}
                aria-selected={activeTab === tab.id}
              >
                {tab.title}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                id={`tab-content-${tab.id}`}
                className={`tab-content prose max-w-none ${activeTab === tab.id ? 'block' : 'hidden'}`}
              >
                <div className="prose-headings:text-[#2C3E50] prose-a:text-[#1A7A64] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline">
                  <div dangerouslySetInnerHTML={{ __html: tab.content }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TabbedInterface;
