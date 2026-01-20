# CLAUDE.md - Booking System Project Context

This file provides context for AI assistants working on this codebase.

## Project Overview

Travel reservation/booking system built with **Next.js 16 + React 19 + Redux Toolkit + Ant Design**. Follows **Clean Architecture** and **Domain-Driven Design (DDD)** principles.

## Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **UI Library**: React 19.2.3
- **State Management**: Redux Toolkit 2.11.2
- **UI Components**: Ant Design 6.1.4
- **Language**: TypeScript 5
- **External APIs**: Mapbox Geocoding API

## Architecture Layers

```
src/
├── app/              # Next.js App Router (routes, API endpoints)
├── application/      # Redux state (slices, store, hooks)
├── domain/           # Business logic (entities, value-objects, use-cases, repositories interfaces)
├── infrastructure/   # Data access (repository implementations, factories, mock data)
└── ui/               # Presentation (components, pages, layouts, models, mappers, theme)
```

### Layer Responsibilities

| Layer | Purpose | Dependencies |
|-------|---------|--------------|
| `app/` | Next.js routing, API routes, providers |
| `application/` | Redux slices, async thunks, typed hooks | domain, infrastructure |
| `domain/` | Entities, value objects, use cases, repo interfaces | None (pure business logic) |
| `infrastructure/` | Repository implementations, external APIs, mock data | domain (implements interfaces) |
| `ui/` | React components, pages, layouts, view models, mappers | application (dispatches actions) |

## Key Directories

### Domain Layer (`src/domain/`)
- `entities/` - Core business objects: `Accommodation`, `Room`, `Booking`, `Location`, `User`
- `value-objects/` - Immutable objects with logic: `DateRange`, `Money`, 
- `use-cases/` - Business operations: `SearchAccommodations`, `GetAccommodationAvailability`, `CreateBooking`
- `repositories/` - Interfaces only (no implementations)

### Infrastructure Layer (`src/infrastructure/`)
- `repositories/` - Implementations: `MockAccommodationRepository`, `MockRoomRepository`, `MapboxLocationRepository`
- `factories/` - DI factory: `createRepositories()`
- `data/` - Mock data: `accommodations.ts`, `rooms.ts`, `bookings.ts`

### UI Layer (`src/ui/`)
- `components/` - Reusable: `SearchForm`, `LocationSearchUI`, `SearchResults`, `Accommodation`, `GlobalLoader`
- `pages/` - Page components: `HomePage`, `SearchPage`, `AccommodationPage`
- `layouts/` - Wrappers: `RootLayout`, `SearchLayout`, `AccommodationLayout`
- `models/` - View models: `AccommodationCardVM`, `AccommodationSearchCardVM`
- `mappers/` - Transformers: `mapSearchResultToCardVM`, `mapAccommodationVM`
- `theme/` - Ant Design config: `antdTheme.ts`

### Application Layer (`src/application/`)
- `slices/` - Redux slices: `searchSlice`, `accommodationSlice`, `uiSlice`
- `store/` - Redux store configuration
- `hooks.ts` - Typed hooks: `useAppDispatch`, `useAppSelector`

## Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Home page |
| `/search` | `app/search/page.tsx` | Search results (query params: city, country, from, to) |
| `/accommodation/[id]` | `app/accommodation/[id]/page.tsx` | Accommodation detail |
| `GET /api/locations` | `app/api/locations/route.ts` | Location autocomplete API |

## Redux State Shape

```typescript
RootState = {
  search: {
    loading: boolean
    error: string | null
    results: AccommodationSearchResult[]
    criteria: { startDate: string, endDate: string } | null
  },
  accommodation: {
    loading: boolean
    error: string | null
    data: AccommodationCardVM | null
  },
  ui: {
    globalLoading: boolean
  }
}
```

## Design Patterns

- **Repository Pattern** - Abstract data access behind interfaces in `domain/repositories/`
- **Factory Pattern** - `createRepositories()` in `infrastructure/factories/`
- **Use Case Pattern** - Single responsibility classes in `domain/use-cases/`
- **Value Objects** - Immutable domain primitives in `domain/value-objects/`
- **DTO Pattern** - Data transfer objects in `domain/use-cases/dto/`
- **ViewModel Pattern** - UI-specific models in `ui/models/`
- **Mapper Pattern** - Domain to VM transformers in `ui/mappers/`

## Conventions

### File Naming
- Components: PascalCase (`SearchForm.tsx`)
- Slices: camelCase with `Slice` suffix (`searchSlice.ts`)
- Use cases: PascalCase (`SearchAccommodations.ts`)
- Repositories: PascalCase with `Repository` suffix (`MockRoomRepository.ts`)
- View models: PascalCase with `VM` suffix (`AccommodationCardVM.ts`)
- Mappers: camelCase with `map` prefix (`mapSearchResultToCardVM.ts`)

### Component Structure
- All components use `"use client"` directive for client-side interactivity
- Use Ant Design components as base (Card, Button, Layout, etc.)
- Use Next.js Image component for optimized images

### State Management
- Async operations use Redux Toolkit `createAsyncThunk`
- Show `globalLoading` during async operations
- Use typed hooks: `useAppDispatch()`, `useAppSelector()`

### Navigation
- Declarative navigation via URL query parameters
- Use `useRouter()` for programmatic navigation
- Use `useSearchParams()` to read query params

## Data Flow Example (Search)

```
User Input (location + dates)
    ↓
SearchForm.tsx
    ↓
router.push("/search?city=X&country=Y&from=...&to=...")
    ↓
SearchPage.tsx reads params
    ↓
dispatch(searchAvailableAccomodations({...}))
    ↓
searchSlice async thunk:
  1. showGlobalLoading()
  2. createRepositories()
  3. SearchAccommodations.execute()
  4. hideGlobalLoading()
    ↓
State updated → UI re-renders
```

## Environment Variables

```env
MAPBOX_TOKEN=<your-mapbox-token>  # Required for location autocomplete
```

## Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

## Current Implementation Status

### Implemented
- Search accommodations by location and dates
- Location autocomplete with Mapbox API
- Accommodation detail view with rooms
- Global loading indicator
- Mock repositories with sample data

### Pending
- Booking creation flow (use case exists, not wired to UI)
- User authentication/sessions
- Payment integration
- Real accommodation API (replace mocks)
- Advanced filters (price range, room type, capacity)
- Map visualization
- Reviews/ratings system

## Adding New Features

### New Use Case
1. Create interface in `domain/use-cases/`
2. Add DTO in `domain/use-cases/dto/` if needed
3. Implement execute method with business logic
4. Call from Redux thunk in `application/slices/`

### New Repository
1. Define interface in `domain/repositories/`
2. Implement in `infrastructure/repositories/`
3. Add to `createRepositories()` factory

### New Page
1. Create route in `app/[route]/page.tsx`
2. Create page component in `ui/pages/`
3. Create layout in `ui/layouts/` if needed
4. Add Redux slice if state is needed

### New Component
1. Create in `ui/components/`
2. Add `"use client"` if interactive
3. Use Ant Design components as base
4. Create ViewModel in `ui/models/` if data transformation needed
5. Create mapper in `ui/mappers/` if needed

## Key Files Reference

| File | Purpose |
|------|---------|
| `application/slices/searchSlice.ts` | Search state and async thunk |
| `application/slices/accommodationSlice.ts` | Accommodation detail state |
| `domain/use-cases/SearchAccommodations.ts` | Core search business logic |
| `infrastructure/factories/createRepositories.ts` | Dependency injection |
| `ui/components/SearchForm.tsx` | Search input form |
| `ui/components/LocationSearchUI.tsx` | Location autocomplete |
| `app/providers.tsx` | Redux provider wrapper |
| `ui/theme/antdTheme.ts` | Ant Design theme config |
