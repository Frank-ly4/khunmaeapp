import { NavigatorScreenParams } from '@react-navigation/native';

export type RootTabParamList = {
  Dashboard: undefined;
  Items: undefined;
  Sales: undefined;
  Expenses: undefined;
  Settings: undefined;
};

export type ItemsStackParamList = {
  ItemsList: undefined;
  ItemForm: { itemId?: string };
};

export type SalesStackParamList = {
  SalesList: undefined;
  SaleForm: undefined;
};

export type ExpensesStackParamList = {
  PurchasesList: undefined;
  PurchaseForm: undefined;
  OverheadsList: undefined;
  OverheadForm: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<RootTabParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
