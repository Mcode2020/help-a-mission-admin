# Help A Mission Admin Panel - RTK & RTK Query Architecture Documentation

## 1. Overview & Objective

This document provides a comprehensive technical guide to the state management and API data fetching architecture implemented in the **Help A Mission Admin Control Hub** (`help-a-mission-admin`).

The architecture leverages **Redux Toolkit (RTK)** for client UI state management and **RTK Query** for server-side data fetching, caching, tag-based invalidation, automatic session re-authentication, and multi-language support.

---

## 2. Recommended Directory Structure

```text
src/
├── app/
│   ├── store.ts            # Central Redux store configuration & middleware
│   └── hooks.ts            # Typed hooks: useAppDispatch, useAppSelector
│
├── services/
│   └── baseApi.ts          # Central RTK Query baseApi service & 401 re-auth
│
├── features/
│   ├── auth/
│   │   ├── authSlice.ts    # Admin user, token, permission selectors
│   │   └── authApi.ts      # Login, logout, refresh, getMe endpoints
│   │
│   ├── cms/
│   │   ├── cmsSlice.ts    # Page selection, tabs, EN/HI lang, draft states
│   │   └── cmsApi.ts      # CMS page query & section update mutations
│   │
│   ├── campaigns/
│   │   └── campaignsApi.ts # Initiatives & NGO work campaigns
│   │
│   ├── gallery/
│   │   └── galleryApi.ts   # Photo gallery assets & category items
│   │
│   ├── donations/
│   │   └── donationsApi.ts # Financial dashboard, donors, transactions, exports
│   │
│   ├── users/
│   │   └── usersApi.ts     # Media library, RBAC roles/permissions, Audit logs
│   │
│   └── ui/
│       └── uiSlice.ts      # Global search, sidebar toggle, modal triggers
│
└── types/
    ├── index.ts            # Core DTO interfaces (AdminUser, Donor, Donation)
    └── cms.ts              # Detailed CMS section content & payload interfaces
```

---

## 3. Store Configuration & Typed Hooks

### `src/app/store.ts`
The store brings together the API reducer slice, feature reducers, and RTK Query middleware:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '../services/baseApi';
import authReducer from '../features/auth/authSlice';
import cmsReducer from '../features/cms/cmsSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    cms: cmsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
  devTools: import.meta.env.MODE !== 'production',
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### `src/app/hooks.ts`
Use `useAppDispatch` and `useAppSelector` throughout the codebase instead of plain `useDispatch` / `useSelector` to enforce strict TypeScript safety:

```typescript
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

---

## 4. Central Base API & Silent 401 Re-Authentication

### `src/services/baseApi.ts`
`baseApi` provides a unified HTTP wrapper using `fetchBaseQuery` equipped with:
1. **Bearer Token Headers**: Automatically attaches `Authorization: Bearer <token>` when a token exists.
2. **Localization Header**: Automatically passes `Accept-Language: <en|hi>` derived from the Redux `cms.language` state.
3. **Automatic 401 Handling**: When an HTTP 401 Unauthorized is encountered, `baseQueryWithReauth` intercepts the response, executes a silent `/admin/auth/refresh` request, updates the session token, and seamlessly retries the original request. If refresh fails, it logs out the session.

```typescript
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'CMS',
    'Home',
    'Campaigns',
    'Gallery',
    'Donations',
    'Donors',
    'Users',
    'Media',
    'RBAC',
    'Audit',
    'Dashboard',
    'Auth',
  ],
  keepUnusedDataFor: 60,
  refetchOnMountOrArgChange: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
```

---

## 5. Feature Modules & RTK Query Endpoints

### 5.1 Authentication (`authSlice` & `authApi`)
- **State**: `admin: AdminUser | null`, `token`, `isAuthenticated`, `isLoading`.
- **API Endpoints**:
  - `useLoginMutation()`: POST `/admin/auth/login`
  - `useLogoutMutation()`: POST `/admin/auth/logout`
  - `useRefreshSessionMutation()`: POST `/admin/auth/refresh`
  - `useGetMeQuery()`: GET `/admin/auth/me`
- **Memoized Selectors**:
  - `selectCurrentAdmin`
  - `selectIsAuthenticated`
  - `selectAuthLoading`
  - `selectHasPermission(permissionKey)`

### 5.2 CMS Manager (`cmsSlice` & `cmsApi`)
- **State**:
  - `activePage`: Active CMS page slug (default `'home'`).
  - `activeTab`: Active section tab (`hero`, `about`, `initiatives`, `gallery`, `donation_settings`, `mission_cta`, `seo`).
  - `language`: Selected language (`'en'` or `'hi'`).
  - `drafts`: Local draft copy for sections prior to publishing.
- **Localization Caching**:
  - Query: `useGetCmsPageQuery({ slug, language })` -> Endpoint `/admin/cms/pages/${slug}?language=${language}`
  - Provides tags: `[{ type: 'CMS', id: `${slug}_${language}` }, { type: 'CMS', id: 'LIST' }]`
  - Mutation: `useUpdateCmsSectionsMutation()` -> Invalidates corresponding language cache tags.

### 5.3 Initiatives & Campaigns (`campaignsApi`)
- `useGetInitiativesQuery(params)`: GET `/public/initiatives?language=${lang}`
- `useCreateInitiativeMutation()`: POST `/admin/initiatives` (invalidates `['Campaigns']`)
- `useUpdateInitiativeMutation()`: PATCH `/admin/initiatives/:id` (invalidates `['Campaigns']`)

### 5.4 Photo Gallery (`galleryApi`)
- `useGetGalleryQuery()`: GET `/public/gallery`
- `useCreateGalleryItemMutation()`: POST `/admin/gallery` (invalidates `['Gallery']`)

### 5.5 Financial & Donations (`donationsApi`)
- `useGetDashboardQuery(params)`: GET `/admin/dashboard` (30s cache TTL for live stats)
- `useGetDonorsQuery({ page, limit })`: GET `/admin/donors`
- `useGetDonationsQuery({ page, limit })`: GET `/admin/donations`
- `useExportReportMutation()`: POST `/admin/reports/export`

### 5.6 Media, RBAC & Audit (`usersApi`)
- `useGetMediaAssetsQuery({ page, limit })`: GET `/admin/media`
- `useUploadMediaMutation()`: POST `/admin/media/upload` (invalidates `['Media']`)
- `useGetPermissionsQuery()`: GET `/admin/rbac/permissions` (5 min cache TTL)
- `useGetRolesQuery()`: GET `/admin/rbac/roles`
- `useCreateRoleMutation()`, `useUpdateRoleMutation()`, `useAssignAccountRolesMutation()`
- `useGetAuditLogsQuery({ page, limit })`: GET `/admin/audit`

### 5.7 Global UI (`uiSlice`)
- `selectSearchQuery` & `setSearchQuery`: Binds global header quick search across tables.
- `selectSidebarOpen` & `toggleSidebar`: Controls responsive layout state.

---

## 6. Cache Invalidation & Lifetime Matrix

| Resource Tag | Endpoint URL | `keepUnusedDataFor` | Invalidating Actions |
| :--- | :--- | :--- | :--- |
| `Dashboard` | `/admin/dashboard` | 30s | Manual refetch, donation webhook |
| `CMS` | `/admin/cms/pages/:slug` | 120s | `updateCmsSections` |
| `Campaigns` | `/public/initiatives` | 120s | `createInitiative`, `updateInitiative` |
| `Gallery` | `/public/gallery` | 120s | `createGalleryItem` |
| `Donors` | `/admin/donors` | 60s | Donor account creation/disable |
| `Donations` | `/admin/donations` | 60s | New payment captured/refunded |
| `Media` | `/admin/media` | 120s | `uploadMedia` |
| `RBAC` | `/admin/rbac/roles` | 120s / 300s (perms) | `createRole`, `updateRole`, `assignAccountRoles` |
| `Audit` | `/admin/audit` | 60s | Background audit stream |

---

## 7. English & Hindi Localization Flow

```text
Admin toggles language ('en' <-> 'hi')
             │
             ▼
dispatch(setLanguage('hi'))
             │
             ▼
Redux State Updated (state.cms.language = 'hi')
             │
             ▼
RTK Query Hook Re-evaluates
useGetCmsPageQuery({ slug: 'home', language: 'hi' })
             │
             ▼
RTK Query checks Cache Key ['CMS', 'home_hi']
┌───────────────────────────┴───────────────────────────┐
│ (Cache Miss)                                          │ (Cache Hit)
▼                                                       ▼
HTTP GET /admin/cms/pages/home?language=hi              Return cached Hindi payload
Headers: Accept-Language: hi                            (Zero network latency)
             │
             ▼
Cache payload under ['CMS', 'home_hi']
```

---

## 8. Developer Best Practices

1. **Avoid `any` Types**: Always type query args, mutation payloads, and API response wrappers cleanly using interfaces from `@/types`.
2. **Never Store API Responses in Slices**: Allow RTK Query to manage server state and caching. Use slices (`cmsSlice`, `uiSlice`, `authSlice`) strictly for UI, form drafts, active tabs, and client authentication status.
3. **Use Memoized Selectors**: When selecting from Redux store, use `createSelector` to avoid re-rendering components unnecessarily.
4. **Invalidate Specific Cache Tags**: On mutations, invalidate specific tags (e.g. `{ type: 'Campaigns', id }`) rather than full cache resets where applicable.
