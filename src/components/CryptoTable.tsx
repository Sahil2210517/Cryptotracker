import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { selectFilteredCryptos, selectIsDarkMode } from '../redux/features/cryptoSlice';
import CryptoRow from './CryptoRow';

type SortField = 
  | 'rank' 
  | 'price' 
  | 'change1h' 
  | 'change24h' 
  | 'change7d' 
  | 'marketCap' 
  | 'volume24h' 
  | 'circulatingSupply';

const CryptoTable: React.FC = () => {
  const cryptocurrencies = useSelector(selectFilteredCryptos);
  const isDarkMode = useSelector(selectIsDarkMode);
  const status = useSelector((state: any) => state.crypto.status);
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedCryptos = () => {
    return [...cryptocurrencies].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'rank':
          comparison = a.rank - b.rank;
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'change1h':
          comparison = a.change1h - b.change1h;
          break;
        case 'change24h':
          comparison = a.change24h - b.change24h;
          break;
        case 'change7d':
          comparison = a.change7d - b.change7d;
          break;
        case 'marketCap':
          comparison = a.marketCap - b.marketCap;
          break;
        case 'volume24h':
          comparison = a.volume24h - b.volume24h;
          break;
        case 'circulatingSupply':
          comparison = a.circulatingSupply - b.circulatingSupply;
          break;
        default:
          comparison = a.rank - b.rank;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const columnWithInfo = (title: string, field: SortField) => (
    <div 
      className="flex items-center space-x-1 cursor-pointer hover:text-blue-400 transition"
      onClick={() => handleSort(field)}
    >
      <span>{title}</span>
      <HelpCircle className={`h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
      {sortField === field && (
        sortDirection === 'asc' ? (
          <ChevronUp className="h-4 w-4 ml-1" />
        ) : (
          <ChevronDown className="h-4 w-4 ml-1" />
        )
      )}
    </div>
  );

  const sortableColumn = (title: string, field: SortField) => (
    <div 
      className="flex items-center cursor-pointer hover:text-blue-400 transition"
      onClick={() => handleSort(field)}
    >
      <span>{title}</span>
      {sortField === field && (
        sortDirection === 'asc' ? (
          <ChevronUp className="h-4 w-4 ml-1" />
        ) : (
          <ChevronDown className="h-4 w-4 ml-1" />
        )
      )}
    </div>
  );

  return (
    <div className={`w-full overflow-x-auto rounded-lg shadow-xl ${
      isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
    }`}>
      <div className="min-w-[1200px]">
        <table className="w-full table-auto">
          <thead className={`sticky top-0 text-sm text-left ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              <th className="px-4 py-3 font-semibold">{sortableColumn('#', 'rank')}</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold text-right">{sortableColumn('Price', 'price')}</th>
              <th className="px-4 py-3 font-semibold text-right">{sortableColumn('1h %', 'change1h')}</th>
              <th className="px-4 py-3 font-semibold text-right">{sortableColumn('24h %', 'change24h')}</th>
              <th className="px-4 py-3 font-semibold text-right">{sortableColumn('7d %', 'change7d')}</th>
              <th className="px-4 py-3 font-semibold text-right">{columnWithInfo('Market Cap', 'marketCap')}</th>
              <th className="px-4 py-3 font-semibold text-right">{columnWithInfo('Volume(24h)', 'volume24h')}</th>
              <th className="px-4 py-3 font-semibold text-right">{columnWithInfo('Circulating Supply', 'circulatingSupply')}</th>
              <th className="px-4 py-3 font-semibold text-center">Last 7 Days</th>
            </tr>
          </thead>
          <tbody>
            {getSortedCryptos().map((crypto) => (
              <CryptoRow key={crypto.id} crypto={crypto} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoTable;