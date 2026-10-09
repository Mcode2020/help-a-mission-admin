import { baseApi } from '../../services/baseApi';
import type { Donor, Donation, FinancialSummary } from '../../types';

export interface DashboardResponse {
  summary: FinancialSummary;
  recentDonations: Donation[];
  metrics: {
    monthlyGrowth: number;
    conversionRate: number;
    activeDonorsCount: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetPaginatedParams {
  page?: number;
  limit?: number;
}

export interface GetDashboardParams {
  startDate?: string;
  endDate?: string;
}

export const donationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardResponse, GetDashboardParams | void>({
      query: (params) => {
        const query = new URLSearchParams();
        if (params?.startDate) query.append('startDate', params.startDate);
        if (params?.endDate) query.append('endDate', params.endDate);
        const qStr = query.toString();
        return `/admin/dashboard${qStr ? `?${qStr}` : ''}`;
      },
      transformResponse: (response: { data?: DashboardResponse } & DashboardResponse): DashboardResponse => {
        return response.data && 'summary' in response.data ? response.data : response;
      },
      providesTags: ['Dashboard'],
      keepUnusedDataFor: 30,
    }),

    getDonors: builder.query<PaginatedResponse<Donor>, GetPaginatedParams | void>({
      query: (params) => {
        const page = params?.page || 1;
        const limit = params?.limit || 20;
        return `/admin/donors?page=${page}&limit=${limit}`;
      },
      transformResponse: (response: { data?: PaginatedResponse<Donor> } & PaginatedResponse<Donor>): PaginatedResponse<Donor> => {
        return response.data && 'data' in response.data ? response.data : response;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Donors' as const, id })),
              { type: 'Donors', id: 'LIST' },
            ]
          : [{ type: 'Donors', id: 'LIST' }],
      keepUnusedDataFor: 60,
    }),

    getDonations: builder.query<PaginatedResponse<Donation>, GetPaginatedParams | void>({
      query: (params) => {
        const page = params?.page || 1;
        const limit = params?.limit || 20;
        return `/admin/donations?page=${page}&limit=${limit}`;
      },
      transformResponse: (response: { data?: PaginatedResponse<Donation> } & PaginatedResponse<Donation>): PaginatedResponse<Donation> => {
        return response.data && 'data' in response.data ? response.data : response;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Donations' as const, id })),
              { type: 'Donations', id: 'LIST' },
            ]
          : [{ type: 'Donations', id: 'LIST' }],
      keepUnusedDataFor: 60,
    }),

    exportReport: builder.mutation<{ downloadUrl: string; filename: string }, { format?: string }>({
      query: ({ format = 'csv' }) => ({
        url: '/admin/reports/export',
        method: 'POST',
        body: { format },
      }),
      transformResponse: (response: { data?: { downloadUrl: string; filename: string } } & { downloadUrl: string; filename: string }) => {
        return response.data || response;
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDashboardQuery,
  useGetDonorsQuery,
  useGetDonationsQuery,
  useExportReportMutation,
} = donationsApi;
