import { baseApi } from '../../services/baseApi';
import type { MediaAsset, Permission, Role, AuditEvent } from '../../types';

export interface PaginatedMedia {
  data: MediaAsset[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedAudit {
  data: AuditEvent[];
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

export interface CreateRoleRequest {
  key: string;
  name: string;
  description: string;
  permissionIds: string[];
}

export interface UpdateRoleRequest {
  id: string;
  roleData: Partial<CreateRoleRequest>;
}

export interface AssignRolesRequest {
  adminId: string;
  roleIds: string[];
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Media Assets
    getMediaAssets: builder.query<PaginatedMedia, GetPaginatedParams | void>({
      query: (params) => {
        const page = params?.page || 1;
        const limit = params?.limit || 30;
        return `/admin/media?page=${page}&limit=${limit}`;
      },
      transformResponse: (response: { data?: PaginatedMedia } & PaginatedMedia): PaginatedMedia => {
        return response.data && 'data' in response.data ? response.data : response;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Media' as const, id })),
              { type: 'Media', id: 'LIST' },
            ]
          : [{ type: 'Media', id: 'LIST' }],
      keepUnusedDataFor: 120,
    }),

    uploadMedia: builder.mutation<MediaAsset, { file: File; visibility?: 'public' | 'private' }>({
      query: ({ file, visibility = 'public' }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('visibility', visibility);
        return {
          url: '/admin/media/upload',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: { data?: MediaAsset } & MediaAsset): MediaAsset => {
        return response.data && 'id' in response.data ? response.data : response;
      },
      invalidatesTags: [{ type: 'Media', id: 'LIST' }],
    }),

    // RBAC Permissions & Roles
    getPermissions: builder.query<{ permissions: Permission[] }, void>({
      query: () => '/admin/rbac/permissions',
      transformResponse: (response: { data?: { permissions: Permission[] } } & { permissions: Permission[] }): { permissions: Permission[] } => {
        return response.data && 'permissions' in response.data ? response.data : response;
      },
      providesTags: ['RBAC'],
      keepUnusedDataFor: 300,
    }),

    getRoles: builder.query<{ roles: Role[] }, void>({
      query: () => '/admin/rbac/roles',
      transformResponse: (response: { data?: { roles: Role[] } } & { roles: Role[] }): { roles: Role[] } => {
        return response.data && 'roles' in response.data ? response.data : response;
      },
      providesTags: ['RBAC'],
      keepUnusedDataFor: 120,
    }),

    createRole: builder.mutation<Role, CreateRoleRequest>({
      query: (body) => ({
        url: '/admin/rbac/roles',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data?: Role } & Role): Role => {
        return response.data && 'id' in response.data ? response.data : response;
      },
      invalidatesTags: ['RBAC'],
    }),

    updateRole: builder.mutation<Role, UpdateRoleRequest>({
      query: ({ id, roleData }) => ({
        url: `/admin/rbac/roles/${id}`,
        method: 'PATCH',
        body: roleData,
      }),
      transformResponse: (response: { data?: Role } & Role): Role => {
        return response.data && 'id' in response.data ? response.data : response;
      },
      invalidatesTags: ['RBAC'],
    }),

    assignAccountRoles: builder.mutation<{ success: boolean }, AssignRolesRequest>({
      query: ({ adminId, roleIds }) => ({
        url: `/admin/rbac/accounts/${adminId}/roles`,
        method: 'PUT',
        body: { roleIds },
      }),
      transformResponse: (response: { data?: { success: boolean } } & { success: boolean }): { success: boolean } => {
        return response.data || response;
      },
      invalidatesTags: ['RBAC', 'Auth'],
    }),

    // Audit Logs
    getAuditLogs: builder.query<PaginatedAudit, GetPaginatedParams | void>({
      query: (params) => {
        const page = params?.page || 1;
        const limit = params?.limit || 20;
        return `/admin/audit?page=${page}&limit=${limit}`;
      },
      transformResponse: (response: { data?: PaginatedAudit } & PaginatedAudit): PaginatedAudit => {
        return response.data && 'data' in response.data ? response.data : response;
      },
      providesTags: ['Audit'],
      keepUnusedDataFor: 60,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMediaAssetsQuery,
  useUploadMediaMutation,
  useGetPermissionsQuery,
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useAssignAccountRolesMutation,
  useGetAuditLogsQuery,
} = usersApi;
