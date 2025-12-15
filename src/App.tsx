import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Info, Moon, Search, Settings, Sun } from 'lucide-react';
import Header from './components/Header';
import CryptoTable from './components/CryptoTable';
import NFTTable from './components/NFTTable';
import { initializeCoinGeckoWebSocket } from './utils/coingeckoApi';
import { AppDispatch } from './redux/store';
import { selectIsDarkMode, setSearchQuery, toggleDarkMode, fetchCryptos, updateCryptoPrice } from './redux/features/cryptoSlice';
import { fetchNFTs, setNFTSearchQuery } from './redux/features/nftSlice';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const isDarkMode = useSelector(selectIsDarkMode);
  const [activeTab, setActiveTab] = useState<'crypto' | 'nft'>('crypto');

  useEffect(() => {
    // Fetch initial crypto data
    dispatch(fetchCryptos());
    // Fetch initial NFT data
    dispatch(fetchNFTs());

    // Initialize WebSocket for real-time updates
    const cleanup = initializeCoinGeckoWebSocket((data) => {
      // Handle real-time price updates
      if (data.symbol && data.price) {
        dispatch(updateCryptoPrice({
          id: data.symbol.toLowerCase(),
          price: data.price,
          change1h: data.change_1h || 0,
          change24h: data.change_24h || 0,
          change7d: data.change_7d || 0,
          volume24h: data.volume_24h || 0,
        }));
      }
    });
    return () => cleanup();
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Header />
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold">
            Today's {activeTab === 'crypto' ? 'Cryptocurrency' : 'NFT'} Prices
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            {/* Tabs */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('crypto')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  activeTab === 'crypto'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Cryptocurrencies
              </button>
              <button
                onClick={() => setActiveTab('nft')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  activeTab === 'nft'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                NFTs
              </button>
            </div>
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder={`Search ${activeTab === 'crypto' ? 'cryptocurrency' : 'NFT'}`}
                onChange={(e) => {
                  if (activeTab === 'crypto') {
                    dispatch(setSearchQuery(e.target.value));
                  } else {
                    dispatch(setNFTSearchQuery(e.target.value));
                  }
                }}
                className={`w-full sm:w-auto py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode 
                    ? 'bg-gray-800 text-white placeholder-gray-400' 
                    : 'bg-white text-gray-900 placeholder-gray-500'
                }`}
              />
              <Search className={`absolute left-3 top-2.5 h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <button className={`p-2 rounded-full transition ${
              isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
            }`}>
              <Settings className="h-5 w-5" />
            </button>
            <button 
              onClick={() => dispatch(toggleDarkMode())}
              className={`p-2 rounded-full transition ${
                isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
              }`}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <button className={`p-2 rounded-full transition ${
              isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
            }`}>
              <Info className="h-5 w-5" />
            </button>
          </div>
        </div>
        {activeTab === 'crypto' ? <CryptoTable /> : <NFTTable />}
      </main>
      <footer className={isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                © 2025 CryptoTracker. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className={`transition ${
                isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>Terms</a>
              <a href="#" className={`transition ${
                isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>Privacy</a>
              <a href="#" className={`transition ${
                isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;