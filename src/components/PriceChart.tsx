import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { ChartData } from '../types';

interface PriceChartProps {
  data: ChartData[];
  isPositive: boolean;
  height?: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ 
  data, 
  isPositive,
  height = 50 
}) => {
  const color = isPositive ? '#34D399' : '#F87171';

  return (
    <div style={{ width: '160px', height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;