import { baseApi } from '../../services/baseApi';
import type { CmsPageData, CmsSectionPayload } from '../../types';

export interface GetCmsPageParams {
  slug: string;
  language?: 'en' | 'hi';
}

export interface UpdateCmsSectionsParams {
  slug: string;
  sections: CmsSectionPayload[] | unknown[];
  language?: 'en' | 'hi';
}

interface CmsPageDataWrapper {
  data?: CmsPageData;
}

export const cmsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCmsPage: builder.query<CmsPageData, GetCmsPageParams | string>({
      query: (arg) => {
        const slug = typeof arg === 'string' ? arg : arg.slug;
        const language = typeof arg === 'string' ? 'en' : arg.language || 'en';
        return `/admin/cms/pages/${slug}?language=${language}`;
      },
      transformResponse: (response: CmsPageDataWrapper | CmsPageData) => {
        return 'data' in response && response.data ? response.data : (response as CmsPageData);
      },
      providesTags: (_result, _error, arg) => {
        const slug = typeof arg === 'string' ? arg : arg.slug;
        const language = typeof arg === 'string' ? 'en' : arg.language || 'en';
        return [
          { type: 'CMS', id: `${slug}_${language}` },
          { type: 'CMS', id: 'LIST' },
        ];
      },
      keepUnusedDataFor: 120, // 2 minutes caching for CMS pages
    }),

    updateCmsSections: builder.mutation<unknown, UpdateCmsSectionsParams>({
      query: ({ slug, sections, language = 'en' }) => ({
        url: `/admin/cms/pages/${slug}/sections?language=${language}`,
        method: 'PUT',
        body: { sections },
      }),
      invalidatesTags: (_result, _error, { slug, language = 'en' }) => [
        { type: 'CMS', id: `${slug}_${language}` },
        { type: 'CMS', id: 'LIST' },
        'Home',
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCmsPageQuery,
  useLazyGetCmsPageQuery,
  useUpdateCmsSectionsMutation,
} = cmsApi;
