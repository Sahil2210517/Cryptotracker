export function generateChartData(days: number, isPositive: boolean, volatility: number = 0.05) {
  const data = [];
  let baseValue = 100;
  
  // If we want a downward trend, start higher
  if (!isPositive) {
    baseValue = 120;
  }

  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Create a random walk with trend
    const randomChange = (Math.random() - (isPositive ? 0.3 : 0.7)) * volatility;
    baseValue = Math.max(1, baseValue * (1 + randomChange));
    
    data.push({
      time: date.toISOString().split('T')[0],
      price: baseValue,
    });
  }
  
  return data;
}