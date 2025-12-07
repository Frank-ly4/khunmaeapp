import React from 'react';
import { Box, Text, VStack, HStack, Button, Divider, Spinner, ScrollView } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  usePeriodSummary,
  useDailyProfitTrend,
  useBestWorstInsights,
} from '../hooks/useDashboard';
import ProfitTrendChart from '../components/ProfitTrendChart';
import { formatCurrency } from '../utils/currency';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../i18n';

interface PeriodSummaryCardProps {
  title: string;
  summary: {
    totalRevenue: number;
    totalCOGS: number;
    grossProfit: number;
    totalOverhead: number;
    netProfit: number;
    netMarginPercent: number | null;
  } | null;
  loading: boolean;
}

function PeriodSummaryCard({ title, summary, loading }: PeriodSummaryCardProps) {
  const { language } = useLanguage();
  if (loading) {
    return (
      <Box bg="white" p={4} rounded="md" shadow={1}>
        <Text fontSize="lg" fontWeight="600" mb={2}>
          {title}
        </Text>
        <Spinner size="sm" color="primary.500" />
      </Box>
    );
  }

  if (!summary) {
    return null;
  }

  const profitColor = summary.netProfit >= 0 ? 'success.500' : 'danger.500';
  const marginColor = summary.netMarginPercent !== null && summary.netMarginPercent >= 0 ? 'success.500' : 'danger.500';

  return (
    <Box bg="white" p={4} rounded="md" shadow={1}>
      <Text fontSize="lg" fontWeight="600" mb={3}>
        {title}
      </Text>
      <VStack space={2}>
        <HStack justifyContent="space-between">
          <Text color="gray.600">{translate('dashboard.revenue', language)}:</Text>
          <Text fontWeight="600">{formatCurrency(summary.totalRevenue)}</Text>
        </HStack>
        <HStack justifyContent="space-between">
          <Text color="gray.600">{translate('dashboard.cogs', language)}:</Text>
          <Text fontWeight="600">{formatCurrency(summary.totalCOGS)}</Text>
        </HStack>
        <HStack justifyContent="space-between">
          <Text color="gray.600">{translate('dashboard.grossProfit', language)}:</Text>
          <Text fontWeight="600" color={summary.grossProfit >= 0 ? 'success.500' : 'danger.500'}>
            {formatCurrency(summary.grossProfit)}
          </Text>
        </HStack>
        <HStack justifyContent="space-between">
          <Text color="gray.600">Overhead:</Text>
          <Text fontWeight="600">{formatCurrency(summary.totalOverhead)}</Text>
        </HStack>
        <Divider my={1} />
        <HStack justifyContent="space-between">
          <Text color="gray.600" fontWeight="600">
            {translate('dashboard.netProfit', language)}:
          </Text>
          <Text fontWeight="bold" fontSize="md" color={profitColor}>
            {formatCurrency(summary.netProfit)}
          </Text>
        </HStack>
        {summary.netMarginPercent !== null && (
          <HStack justifyContent="space-between">
            <Text color="gray.600">{translate('dashboard.netMargin', language)}:</Text>
            <Text fontWeight="600" color={marginColor}>
              {summary.netMarginPercent.toFixed(1)}%
            </Text>
          </HStack>
        )}
      </VStack>
    </Box>
  );
}

export default function DashboardScreen() {
  const navigation = useNavigation();
  const todaySummary = usePeriodSummary('today');
  const weekSummary = usePeriodSummary('week');
  const monthSummary = usePeriodSummary('month');
  const profitTrend = useDailyProfitTrend(7);
  const insights = useBestWorstInsights('month');
  const { language } = useLanguage();

  const isLoading =
    todaySummary.loading || weekSummary.loading || monthSummary.loading || profitTrend.loading || insights.loading;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <Box flex={1} bg="gray.50" p={4}>
          <VStack space={4}>
            <HStack justifyContent="space-between" alignItems="center">
              <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                {translate('dashboard.title', language)}
              </Text>
              {isLoading && <Spinner size="sm" color="primary.500" />}
            </HStack>

            <Divider />

            <PeriodSummaryCard
              title={translate('dashboard.today', language)}
              summary={todaySummary.summary}
              loading={todaySummary.loading}
            />
            <PeriodSummaryCard
              title={translate('dashboard.thisWeek', language)}
              summary={weekSummary.summary}
              loading={weekSummary.loading}
            />
            <PeriodSummaryCard
              title={translate('dashboard.thisMonth', language)}
              summary={monthSummary.summary}
              loading={monthSummary.loading}
            />

            {profitTrend.data.length > 0 && (
              <ProfitTrendChart data={profitTrend.data} height={200} color="#2196f3" />
            )}

            {insights.bestWorstTimes && insights.bestWorstDays && (
              <Box bg="white" p={4} rounded="md" shadow={1}>
                <Text fontSize="lg" fontWeight="600" mb={3}>
                  Best/Worst Insights
                </Text>
                <VStack space={3}>
                  {insights.bestWorstDays.bestDay && (
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        Best Day:
                      </Text>
                      <HStack justifyContent="space-between" alignItems="center">
                        <Text fontWeight="600">{insights.bestWorstDays.bestDay}</Text>
                        <Text fontWeight="600" color="success.500">
                          {formatCurrency(insights.bestWorstDays.bestNetProfit)}
                        </Text>
                      </HStack>
                    </Box>
                  )}
                  {insights.bestWorstDays.worstDay && (
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        Worst Day:
                      </Text>
                      <HStack justifyContent="space-between" alignItems="center">
                        <Text fontWeight="600">{insights.bestWorstDays.worstDay}</Text>
                        <Text fontWeight="600" color="danger.500">
                          {formatCurrency(insights.bestWorstDays.worstNetProfit)}
                        </Text>
                      </HStack>
                    </Box>
                  )}
                  {insights.bestWorstTimes.bestHour && (
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        Best Hour:
                      </Text>
                      <HStack justifyContent="space-between" alignItems="center">
                        <Text fontWeight="600">{insights.bestWorstTimes.bestHour}</Text>
                        <Text fontWeight="600" color="success.500">
                          {formatCurrency(insights.bestWorstTimes.bestNetProfit)}
                        </Text>
                      </HStack>
                    </Box>
                  )}
                  {insights.bestWorstTimes.worstHour && (
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        Worst Hour:
                      </Text>
                      <HStack justifyContent="space-between" alignItems="center">
                        <Text fontWeight="600">{insights.bestWorstTimes.worstHour}</Text>
                        <Text fontWeight="600" color="danger.500">
                          {formatCurrency(insights.bestWorstTimes.worstNetProfit)}
                        </Text>
                      </HStack>
                    </Box>
                  )}
                </VStack>
              </Box>
            )}

            <VStack space={2} mt={4}>
              <Button
                colorScheme="primary"
                size="lg"
                onPress={() => navigation.navigate('Sales' as never, { screen: 'SaleForm' } as never)}
              >
                Add Sale
              </Button>
              <Button
                colorScheme="secondary"
                size="lg"
                onPress={() => navigation.navigate('Expenses' as never, { screen: 'OverheadForm' } as never)}
              >
                Add Expense
              </Button>
              <Button
                variant="outline"
                size="lg"
                onPress={() => navigation.navigate('Items' as never, { screen: 'ItemForm' } as never)}
              >
                Add Item
              </Button>
            </VStack>
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
