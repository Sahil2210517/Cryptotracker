import React, { useRef, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, selectIsDarkMode } from '../redux/features/cryptoSlice';
import PriceChart from './PriceChart';
import { Crypto } from '../types';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';

interface CryptoRowProps {
  crypto: Crypto;
}

const CryptoRow: React.FC<CryptoRowProps> = ({ crypto }) => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector(selectIsDarkMode);
  const priceRef = useRef<HTMLTableDataCellElement>(null);
  const prevPrice = useRef<number>(crypto.price);
  
  useEffect(() => {
    if (priceRef.current && prevPrice.current !== crypto.price) {
      const className = crypto.price > prevPrice.current ? 'price-up' : 'price-down';
      priceRef.current.classList.add(className);
      
      const timer = setTimeout(() => {
        if (priceRef.current) {
          priceRef.current.classList.remove(className);
        }
      }, 1000);
      
      prevPrice.current = crypto.price;
      
      return () => clearTimeout(timer);
    }
  }, [crypto.price]);

  const getChangeClass = (value: number) => {
    return value >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const getChangeIcon = (value: number) => {
    return value >= 0 ? '▲' : '▼';
  };

  return (
    <tr className={`border-b transition-colors ${
      isDarkMode 
        ? 'border-gray-700 hover:bg-gray-750' 
        : 'border-gray-200 hover:bg-gray-50'
    }`}>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <button 
            onClick={() => dispatch(toggleFavorite(crypto.id))}
            className="mr-3 focus:outline-none"
          >
            <Star 
              className={`h-5 w-5 ${
                crypto.isFavorite 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`} 
            />
          </button>
          <span>{crypto.rank}</span>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <img 
            src={crypto.logoUrl} 
            alt={crypto.name} 
            className="w-7 h-7 mr-3 rounded-full" 
          />
          <div>
            <div className="font-medium">{crypto.name}</div>
            <div className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
              {crypto.symbol}
            </div>
          </div>
        </div>
      </td>
      <td ref={priceRef} className="px-4 py-4 text-right whitespace-nowrap font-medium">
        {formatCurrency(crypto.price)}
      </td>
      <td className={`px-4 py-4 text-right whitespace-nowrap ${getChangeClass(crypto.change1h)}`}>
        {getChangeIcon(crypto.change1h)} {formatPercentage(crypto.change1h)}
      </td>
      <td className={`px-4 py-4 text-right whitespace-nowrap ${getChangeClass(crypto.change24h)}`}>
        {getChangeIcon(crypto.change24h)} {formatPercentage(crypto.change24h)}
      </td>
      <td className={`px-4 py-4 text-right whitespace-nowrap ${getChangeClass(crypto.change7d)}`}>
        {getChangeIcon(crypto.change7d)} {formatPercentage(crypto.change7d)}
      </td>
      <td className="px-4 py-4 text-right whitespace-nowrap">
        {formatCurrency(crypto.marketCap)}
      </td>
      <td className="px-4 py-4 text-right whitespace-nowrap">
        <div>{formatCurrency(crypto.volume24h)}</div>
        <div className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
          {formatNumber(crypto.volumeCrypto)} {crypto.symbol}
        </div>
      </td>
      <td className="px-4 py-4 text-right whitespace-nowrap">
        <div>{formatNumber(crypto.circulatingSupply)} {crypto.symbol}</div>
        {crypto.maxSupply && (
          <div className="mt-1 w-full bg-gray-700 rounded-full h-1.5">
            <div 
              className="bg-blue-500 h-1.5 rounded-full" 
              style={{ width: `${(crypto.circulatingSupply / crypto.maxSupply) * 100}%` }}
            ></div>
          </div>
        )}
      </td>
      <td className="px-4 py-4 text-center">
        <PriceChart 
          data={crypto.chartData}
          isPositive={crypto.change7d >= 0}
        />
      </td>
    </tr>
  );
};

export default CryptoRow;