import React from 'react';
import { Box, Text } from 'native-base';
import { View, Dimensions } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from 'victory-native';
import { DailyProfitData } from '../services/analyticsService';
import { formatCurrency } from '../utils/currency';

interface ProfitTrendChartProps {
  data: DailyProfitData[];
  height?: number;
  color?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 64; // Account for padding

export default function ProfitTrendChart({
  data,
  height = 200,
  color = '#2196f3',
}: ProfitTrendChartProps) {
  if (data.length === 0) {
    return (
      <Box height={height} justifyContent="center" alignItems="center" bg="gray.50" rounded="md">
        <Text color="gray.500" fontSize="sm">
          No data available
        </Text>
      </Box>
    );
  }

  // Transform data for Victory
  const chartData = data.map((item, index) => ({
    x: index + 1,
    y: item.netProfit,
    label: item.date,
  }));

  // Find min and max for Y-axis
  const profits = data.map((d) => d.netProfit);
  const minProfit = Math.min(...profits, 0);
  const maxProfit = Math.max(...profits, 0);
  const yDomain = [
    minProfit < 0 ? minProfit * 1.1 : minProfit * 0.9,
    maxProfit > 0 ? maxProfit * 1.1 : maxProfit * 0.9 || 100,
  ];

  return (
    <Box bg="white" p={4} rounded="md" shadow={1}>
      <Text fontSize="md" fontWeight="600" mb={2}>
        Profit Trend
      </Text>
      <View style={{ height, width: CHART_WIDTH }}>
        <VictoryChart
          theme={VictoryTheme.material}
          width={CHART_WIDTH}
          height={height}
          padding={{ left: 50, right: 20, top: 20, bottom: 40 }}
          domain={{ y: yDomain }}
        >
          <VictoryAxis
            dependentAxis
            tickFormat={(tick) => formatCurrency(tick)}
            style={{
              axis: { stroke: '#757575' },
              tickLabels: { fill: '#757575', fontSize: 10 },
              grid: { stroke: '#e0e0e0', strokeDasharray: '4,4' },
            }}
          />
          <VictoryAxis
            tickFormat={(tick, index) => {
              if (index < chartData.length) {
                return chartData[index].label;
              }
              return '';
            }}
            style={{
              axis: { stroke: '#757575' },
              tickLabels: { fill: '#757575', fontSize: 10, angle: -45 },
            }}
          />
          <VictoryLine
            data={chartData}
            style={{
              data: { stroke: color, strokeWidth: 2 },
            }}
            interpolation="linear"
          />
        </VictoryChart>
      </View>
    </Box>
  );
}

