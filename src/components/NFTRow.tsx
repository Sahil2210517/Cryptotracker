import React from 'react';
import { Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleNFTFavorite } from '../redux/features/nftSlice';
import { selectIsDarkMode } from '../redux/features/cryptoSlice';
import PriceChart from './PriceChart';
import { NFT } from '../types';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';

interface NFTRowProps {
  nft: NFT;
}

const NFTRow: React.FC<NFTRowProps> = ({ nft }) => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector(selectIsDarkMode);

  const getChangeClass = (value: number | null) => {
    if (value === null) return '';
    return value >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const getChangeIcon = (value: number | null) => {
    if (value === null) return '';
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
            onClick={() => dispatch(toggleNFTFavorite(nft.id))}
            className="mr-3 focus:outline-none"
          >
            <Star
              className={`h-5 w-5 ${
                nft.isFavorite
                  ? 'text-yellow-400 fill-yellow-400'
                  : isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}
            />
          </button>
          <span>{/* Rank not available for NFTs */}</span>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <img
            src={nft.thumb}
            alt={nft.name}
            className="w-7 h-7 mr-3 rounded-full"
          />
          <div>
            <div className="font-medium">{nft.name}</div>
            <div className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
              {nft.symbol}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-right whitespace-nowrap font-medium">
        {nft.floorPrice ? formatCurrency(nft.floorPrice) : 'N/A'}
      </td>
      <td className={`px-4 py-4 text-right whitespace-nowrap ${getChangeClass(nft.change24h)}`}>
        {nft.change24h !== null ? `${getChangeIcon(nft.change24h)} ${formatPercentage(nft.change24h)}` : 'N/A'}
      </td>
      <td className={`px-4 py-4 text-right whitespace-nowrap ${getChangeClass(nft.change7d)}`}>
        {nft.change7d !== null ? `${getChangeIcon(nft.change7d)} ${formatPercentage(nft.change7d)}` : 'N/A'}
      </td>
      <td className={`px-4 py-4 text-right whitespace-nowrap ${getChangeClass(nft.change30d)}`}>
        {nft.change30d !== null ? `${getChangeIcon(nft.change30d)} ${formatPercentage(nft.change30d)}` : 'N/A'}
      </td>
      <td className="px-4 py-4 text-right whitespace-nowrap">
        {nft.marketCap ? formatCurrency(nft.marketCap) : 'N/A'}
      </td>
      <td className="px-4 py-4 text-right whitespace-nowrap">
        {nft.volume24h ? formatCurrency(nft.volume24h) : 'N/A'}
      </td>
      <td className="px-4 py-4 text-right whitespace-nowrap">
        {nft.totalSupply ? formatNumber(nft.totalSupply) : 'N/A'}
      </td>
      <td className="px-4 py-4 text-right whitespace-nowrap">
        {nft.numberOfOwners ? formatNumber(nft.numberOfOwners) : 'N/A'}
      </td>
      <td className="px-4 py-4 text-center">
        <PriceChart
          data={nft.chartData}
          isPositive={(nft.change7d || 0) >= 0}
        />
      </td>
    </tr>
  );
};

export default NFTRow;