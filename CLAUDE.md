## Architecture Analysis (Clean Architecture Compliance)

### Layer Dependency Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      app/ (Next.js Router)                  │
│         Routes, API endpoints, Providers, Layouts           │
├─────────────────────────────────────────────────────────────┤
│                     ui/ (Presentation)                      │
│      Components, Pages, ViewModels, Mappers, Theme          │
├─────────────────────────────────────────────────────────────┤
│                   application/ (Redux)                      │
│         Slices, Services, Store, Typed Hooks                │
├─────────────────────────────────────────────────────────────┤
│               infrastructure/ (Data Access)                 │
│     Repositories Impl, Factories, Supabase, Mapbox          │
├─────────────────────────────────────────────────────────────┤
│                    domain/ (Core)                           │
│   Entities, Value Objects, Use Cases, Repository Interfaces │
└─────────────────────────────────────────────────────────────┘
```

**Dependency Flow:** `app → ui → application → infrastructure → domain`

### Layer Mapping

| Layer | Location | Responsibility | Dependencies |
|-------|----------|----------------|--------------|
| **Domain** | `src/domain/` | Entities, Value Objects, Repository Interfaces, Use Cases | **None** (pure) |
| **Infrastructure** | `src/infrastructure/` | Repository implementations (Supabase, Mock, Mapbox), Factory DI | Only `domain/` |
| **Application** | `src/application/` | Redux slices, async thunks, services orchestrating use cases | `domain/`, `infrastructure/`, `ui/models` |
| **Presentation** | `src/ui/` | React components, ViewModels, Mappers | `application/`, `domain/` (DTOs only) |
| **App Router** | `src/app/` | Next.js routes, API routes, providers | All layers |

### Clean Architecture Compliance

| Aspect | Status | Details |
|--------|--------|---------|
| **Layer Isolation** | ✓ Good | Clear boundaries, unidirectional flow |
| **Dependency Direction** | ✓ Good | All point towards domain (bottom-up) |
| **Domain Purity** | ✓ Perfect | Zero external dependencies |
| **Repository Pattern** | ✓ Perfect | Interfaces in domain, implementations in infrastructure |
| **Dependency Injection** | ✓ Good | Factory pattern with environment-based mode switching |
| **DTO Usage** | ✓ Good | DTOs prevent entity leakage across layers |
| **ViewModel Pattern** | ✓ Good | Mappers transform for UI needs |

### Repository Mode Switching

The factory `createAppRepositories()` supports environment-based switching:

```env
NEXT_PUBLIC_REPOSITORY_MODE=mock    # Use mock repositories (development/testing)
NEXT_PUBLIC_REPOSITORY_MODE=supabase # Use Supabase repositories (production)
```

Or pass mode directly:
```typescript
const repos = createAppRepositories("mock");
const repos = createAppRepositories("supabase");
```

### Minor Architectural Notes

1. **Application → UI coupling**: Slices import from `ui/models` and `ui/mappers`. This is acceptable for pragmatic reasons but ideally these could live in `application/`.

2. **API Routes**: Use `application/services/` for consistency (e.g., `LocationService.ts` for `/api/locations`).

---

## Auth Integration Strategy (Supabase)

### Recommended Location in Architecture

```
domain/
├── entities/
│   └── User.ts                    # Already exists - extend if needed
├── repositories/
│   └── AuthRepository.ts          # NEW: interface
└── use-cases/
    ├── SignIn.ts                  # NEW
    ├── SignOut.ts                 # NEW
    ├── GetCurrentUser.ts          # NEW
    └── SignUp.ts                  # NEW (if needed)

infrastructure/
├── db/
│   └── supabaseClient.ts          # Already exists - reuse
└── repositories/
    └── SupabaseAuthRepository.ts  # NEW: implementation

application/
├── services/
│   └── AuthService.ts             # NEW: orchestrates use cases
├── slices/
│   └── authSlice.ts               # NEW: session state
└── hooks.ts                       # Extend with useAuth()

app/
├── providers.tsx                  # Add AuthProvider
└── api/
    └── auth/                      # NEW: auth routes (optional)
```

### Auth Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    UI (LoginForm.tsx)                       │
│                         ↓                                   │
│              dispatch(signIn(credentials))                  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                  authSlice.ts (Thunk)                       │
│                         ↓                                   │
│                 signInService()                             │
│                         ↓                                   │
│    SignIn.execute() → authRepository.signIn()               │
│                         ↓                                   │
│         SupabaseAuthRepository → supabase.auth.signIn()     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│              Redux State: auth.user, auth.session           │
└─────────────────────────────────────────────────────────────┘
```

### Key Interfaces

**Domain (AuthRepository.ts):**
```typescript
interface AuthRepository {
  signIn(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  onAuthStateChange(callback: (user: User | null) => void): () => void;
}
```

**Application (authSlice.ts state):**
```typescript
interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
```

### Integration with Booking

1. `CreateBooking` use case already receives `userId` - connect to authenticated user
2. `bookingSlice.confirmBooking` should get `userId` from `auth.user` state
3. Protect `/booking` routes by checking `isAuthenticated`
