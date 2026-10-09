import { baseApi } from '../../services/baseApi';
import type { Initiative } from '../../types';

export interface GetInitiativesParams {
  language?: 'en' | 'hi';
}

export interface CreateInitiativeRequest {
  title: string;
  slug?: string;
  summary: string;
  body: string;
  cover_media_asset_id?: string;
  status?: 'draft' | 'published' | 'archived';
}

export interface UpdateInitiativeRequest {
  id: string;
  data: Partial<CreateInitiativeRequest>;
}

interface InitiativeDataWrapper {
  data?: Initiative | Initiative[];
}

export const campaignsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInitiatives: builder.query<Initiative[], GetInitiativesParams | void>({
      query: (params) => {
        const lang = params?.language || 'en';
        return `/public/initiatives?language=${lang}`;
      },
      transformResponse: (response: InitiativeDataWrapper | Initiative[]) => {
        return 'data' in response && Array.isArray(response.data) ? response.data : (response as Initiative[]);
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Campaigns' as const, id })),
              { type: 'Campaigns', id: 'LIST' },
            ]
          : [{ type: 'Campaigns', id: 'LIST' }],
      keepUnusedDataFor: 120,
    }),

    createInitiative: builder.mutation<Initiative, CreateInitiativeRequest>({
      query: (body) => ({
        url: '/admin/initiatives',
        method: 'POST',
        body,
      }),
      transformResponse: (response: InitiativeDataWrapper | Initiative) => {
        return 'data' in response && response.data ? (response.data as Initiative) : (response as Initiative);
      },
      invalidatesTags: [{ type: 'Campaigns', id: 'LIST' }],
    }),

    updateInitiative: builder.mutation<Initiative, UpdateInitiativeRequest>({
      query: ({ id, data }) => ({
        url: `/admin/initiatives/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (response: InitiativeDataWrapper | Initiative) => {
        return 'data' in response && response.data ? (response.data as Initiative) : (response as Initiative);
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Campaigns', id },
        { type: 'Campaigns', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetInitiativesQuery,
  useCreateInitiativeMutation,
  useUpdateInitiativeMutation,
} = campaignsApi;
