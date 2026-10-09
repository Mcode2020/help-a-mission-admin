import { baseApi } from '../../services/baseApi';
import type { GalleryItem } from '../../types';

export interface CreateGalleryItemRequest {
  media_asset_id: string;
  title?: string;
  caption?: string;
  alt_text?: string;
  category?: string;
  sort_order?: number;
  status?: 'published' | 'draft';
}

interface GalleryDataWrapper {
  data?: GalleryItem | GalleryItem[];
}

export const galleryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGallery: builder.query<GalleryItem[], void>({
      query: () => '/public/gallery',
      transformResponse: (response: GalleryDataWrapper | GalleryItem[]) => {
        return 'data' in response && Array.isArray(response.data) ? response.data : (response as GalleryItem[]);
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Gallery' as const, id })),
              { type: 'Gallery', id: 'LIST' },
            ]
          : [{ type: 'Gallery', id: 'LIST' }],
      keepUnusedDataFor: 120,
    }),

    createGalleryItem: builder.mutation<GalleryItem, CreateGalleryItemRequest>({
      query: (body) => ({
        url: '/admin/gallery',
        method: 'POST',
        body,
      }),
      transformResponse: (response: GalleryDataWrapper | GalleryItem) => {
        return 'data' in response && response.data ? (response.data as GalleryItem) : (response as GalleryItem);
      },
      invalidatesTags: [{ type: 'Gallery', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetGalleryQuery,
  useCreateGalleryItemMutation,
} = galleryApi;
