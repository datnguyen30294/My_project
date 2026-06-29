import type {
  CashFlowSummaryResource,
  CashFlowDailyResource,
  CashFlowTransactionResource,
  CashFlowReportDaily200,
  CashFlowReportTransactions200,
  CashFlowReportSummaryParams,
  CashFlowReportDailyParams,
  CashFlowReportTransactionsParams
} from '#api/generated/laravel'

// ─── Corrected types (Scramble infers inflow/outflow_by_category as `string`) ───

export interface CashFlowCategory {
  category: { value: string, label: string }
  amount: string
  count: number
}

export interface CashFlowSummary extends Omit<CashFlowSummaryResource, 'inflow_by_category' | 'outflow_by_category'> {
  inflow_by_category: CashFlowCategory[]
  outflow_by_category: CashFlowCategory[]
}

export interface CashFlowSummaryResponse {
  data: CashFlowSummary
  success: boolean
}

export type CashFlowDaily = CashFlowDailyResource
export type CashFlowTransaction = CashFlowTransactionResource

export type { CashFlowReportDaily200, CashFlowReportTransactions200 }

// ─── Queries ───

export function useCashFlowSummary(params: MaybeRefOrGetter<CashFlowReportSummaryParams>) {
  return useApiFetch<CashFlowSummaryResponse>('/pmc/reports/cashflow/summary', {
    query: params,
    watch: [params]
  })
}

export function useCashFlowDaily(params: MaybeRefOrGetter<CashFlowReportDailyParams>) {
  return useApiFetch<CashFlowReportDaily200>('/pmc/reports/cashflow/daily', {
    query: params,
    watch: [params]
  })
}

export function useCashFlowTransactions(params: MaybeRefOrGetter<CashFlowReportTransactionsParams & { page?: number }>) {
  return useApiFetch<CashFlowReportTransactions200>('/pmc/reports/cashflow/transactions', {
    query: params,
    watch: [params]
  })
}
