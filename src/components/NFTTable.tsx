import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { selectFilteredNFTs } from '../redux/features/nftSlice';
import { selectIsDarkMode } from '../redux/features/cryptoSlice';
import NFTRow from './NFTRow';

type SortField =
  | 'name'
  | 'floorPrice'
  | 'change24h'
  | 'change7d'
  | 'change30d'
  | 'marketCap'
  | 'volume24h'
  | 'totalSupply'
  | 'numberOfOwners';

const NFTTable: React.FC = () => {
  const nfts = useSelector(selectFilteredNFTs);
  const isDarkMode = useSelector(selectIsDarkMode);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedNFTs = () => {
    return [...nfts].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'floorPrice':
          comparison = (a.floorPrice || 0) - (b.floorPrice || 0);
          break;
        case 'change24h':
          comparison = (a.change24h || 0) - (b.change24h || 0);
          break;
        case 'change7d':
          comparison = (a.change7d || 0) - (b.change7d || 0);
          break;
        case 'change30d':
          comparison = (a.change30d || 0) - (b.change30d || 0);
          break;
        case 'marketCap':
          comparison = (a.marketCap || 0) - (b.marketCap || 0);
          break;
        case 'volume24h':
          comparison = (a.volume24h || 0) - (b.volume24h || 0);
          break;
        case 'totalSupply':
          comparison = (a.totalSupply || 0) - (b.totalSupply || 0);
          break;
        case 'numberOfOwners':
          comparison = (a.numberOfOwners || 0) - (b.numberOfOwners || 0);
          break;
        default:
          comparison = a.name.localeCompare(b.name);
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
              <th className="px-4 py-3 font-semibold">#</th>
              <th className="px-4 py-3 font-semibold">{sortableColumn('Name', 'name')}</th>
              <th className="px-4 py-3 font-semibold text-right">{sortableColumn('Floor Price', 'floorPrice')}</th>
              <th className="px-4 py-3 font-semibold text-right">{sortableColumn('24h %', 'change24h')}</th>
              <th className="px-4 py-3 font-semibold text-right">{sortableColumn('7d %', 'change7d')}</th>
              <th className="px-4 py-3 font-semibold text-right">{sortableColumn('30d %', 'change30d')}</th>
              <th className="px-4 py-3 font-semibold text-right">{columnWithInfo('Market Cap', 'marketCap')}</th>
              <th className="px-4 py-3 font-semibold text-right">{columnWithInfo('Volume(24h)', 'volume24h')}</th>
              <th className="px-4 py-3 font-semibold text-right">{columnWithInfo('Total Supply', 'totalSupply')}</th>
              <th className="px-4 py-3 font-semibold text-right">{columnWithInfo('Owners', 'numberOfOwners')}</th>
              <th className="px-4 py-3 font-semibold text-center">Last 7 Days</th>
            </tr>
          </thead>
          <tbody>
            {getSortedNFTs().map((nft) => (
              <NFTRow key={nft.id} nft={nft} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NFTTable;