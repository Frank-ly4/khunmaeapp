import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Box, Text } from 'native-base';
import { RootTabParamList, ItemsStackParamList, SalesStackParamList, ExpensesStackParamList } from '../types/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../i18n';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import ItemsScreen from '../screens/ItemsScreen';
import ItemFormScreen from '../screens/ItemFormScreen';
import SalesScreen from '../screens/SalesScreen';
import SaleFormScreen from '../screens/SaleFormScreen';
import PurchasesScreen from '../screens/PurchasesScreen';
import PurchaseFormScreen from '../screens/PurchaseFormScreen';
import OverheadsScreen from '../screens/OverheadsScreen';
import OverheadFormScreen from '../screens/OverheadFormScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator<RootTabParamList>();
const ItemsStack = createNativeStackNavigator<ItemsStackParamList>();
const SalesStack = createNativeStackNavigator<SalesStackParamList>();
const ExpensesStack = createNativeStackNavigator<ExpensesStackParamList>();

// Simple icon component (can be replaced with react-native-vector-icons later)
const TabIcon = ({ name }: { name: string; focused: boolean }) => {
  const icons: Record<string, string> = {
    Dashboard: '📊',
    Items: '📦',
    Sales: '💰',
    Expenses: '📝',
    Settings: '⚙️',
  };
  
  return (
    <Box alignItems="center">
      <Text fontSize="20">{icons[name] || '•'}</Text>
    </Box>
  );
};

function ItemsStackNavigator() {
  const { language } = useLanguage();
  return (
    <ItemsStack.Navigator>
      <ItemsStack.Screen
        name="ItemsList"
        component={ItemsScreen}
        options={{ title: translate('items.title', language), headerShown: false }}
      />
      <ItemsStack.Screen
        name="ItemForm"
        component={ItemFormScreen}
        options={{ title: 'Item' }}
      />
    </ItemsStack.Navigator>
  );
}

function SalesStackNavigator() {
  const { language } = useLanguage();
  return (
    <SalesStack.Navigator>
      <SalesStack.Screen
        name="SalesList"
        component={SalesScreen}
        options={{ title: translate('sales.title', language), headerShown: false }}
      />
      <SalesStack.Screen
        name="SaleForm"
        component={SaleFormScreen}
        options={{ title: 'Add Sale' }}
      />
    </SalesStack.Navigator>
  );
}

function ExpensesStackNavigator() {
  const { language } = useLanguage();
  return (
    <ExpensesStack.Navigator>
      <ExpensesStack.Screen
        name="PurchasesList"
        component={PurchasesScreen}
        options={{ title: translate('purchases.title', language), headerShown: false }}
      />
      <ExpensesStack.Screen
        name="PurchaseForm"
        component={PurchaseFormScreen}
        options={{ title: 'Add Purchase' }}
      />
      <ExpensesStack.Screen
        name="OverheadsList"
        component={OverheadsScreen}
        options={{ title: translate('overheads.title', language), headerShown: false }}
      />
      <ExpensesStack.Screen
        name="OverheadForm"
        component={OverheadFormScreen}
        options={{ title: 'Add Overhead' }}
      />
    </ExpensesStack.Navigator>
  );
}

export default function AppNavigator() {
  const { language } = useLanguage();
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
          tabBarActiveTintColor: '#2196f3',
          tabBarInactiveTintColor: '#757575',
          headerStyle: {
            backgroundColor: '#2196f3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: translate('nav.dashboard', language) }}
        />
        <Tab.Screen
          name="Items"
          component={ItemsStackNavigator}
          options={{ title: translate('nav.items', language), headerShown: false }}
        />
        <Tab.Screen
          name="Sales"
          component={SalesStackNavigator}
          options={{ title: translate('nav.sales', language), headerShown: false }}
        />
        <Tab.Screen
          name="Expenses"
          component={ExpensesStackNavigator}
          options={{ title: translate('nav.expenses', language), headerShown: false }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: translate('nav.settings', language) }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
