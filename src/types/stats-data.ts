export interface TopOperator {
  operatorId: string;
  operatorName: string;
  totalTestSessions: number;
}

export interface Product {
  product: string;
  total: number;
}

export interface Stats {
  totalOperators: number;
  totalProducts: number;
  totalFailedTests: number;
  totalPassedTests: number;
  totalTestSessions: number;
  totalDuration: string;
  latestOperatorId: string;
  latestTestSessionId: string;
  topOperators: TopOperator[];
  topProducts: Product[];
  products: Product[];
  averageDuration: string;
  averagePassRate: number;
}
