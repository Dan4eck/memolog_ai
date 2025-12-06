# Authentication Implementation

## What Was Implemented

Token-based authentication system using Supabase Auth with Google OAuth provider. Users sign in with their Google account and receive 10 free tokens on signup. The system protects routes requiring authentication and manages user sessions across the application.

## How It Works

### Authentication Flow

The system uses PKCE (Proof Key for Code Exchange) flow for secure server-side authentication. When a user clicks "Continue with Google", they are redirected to Google's OAuth consent screen. After authorization, Google redirects back to Supabase with an authorization code. Supabase exchanges this code for a session and redirects to the application callback route. The callback route validates the session and redirects the user to their intended destination.

### Smart Redirect System

When unauthenticated users attempt to access protected routes, the middleware captures their intended destination in a `next` query parameter. After successful authentication, users are redirected to this original destination rather than a generic landing page. If no redirect is specified, users land on the dashboard by default.

### Session Management

User sessions are stored in HTTP-only cookies managed by Supabase. The middleware refreshes sessions on each request, ensuring users remain authenticated across page navigations. Sessions persist across browser sessions until the user explicitly signs out.

### Route Protection

The middleware intercepts all requests and checks authentication status. Protected routes (`/generate`, `/dashboard`) require an active session. Unauthenticated requests to these routes redirect to the login page. Authenticated users attempting to access the login page are redirected to the dashboard.

## Technical Implementation

### Supabase Client Architecture

Two separate client instances handle browser and server contexts. The browser client (`lib/supabase/client.ts`) is used in Client Components for client-side operations like initiating OAuth flows. The server client (`lib/supabase/server.ts`) is used in Server Components and API routes, with cookie handling for session persistence.

### Database Integration

A PostgreSQL trigger automatically creates a profile record when a new user signs up through Supabase Auth. The `handle_new_user()` function extracts user metadata (email, full name) from the auth provider and initializes the user's token balance to 10. This ensures every authenticated user has a corresponding profile in the database.

### Middleware Layer

Next.js middleware runs on every request before route handlers. It creates a Supabase client with cookie access, retrieves the current user session, and enforces authentication rules. The middleware handles cookie propagation between the request and response to maintain session state.

### OAuth Callback Handler

The `/auth/callback` route receives the authorization code from Google via Supabase. It calls `exchangeCodeForSession()` to convert the code into a user session, sets the session cookies, and redirects to the target page. Error cases redirect to the login page with an error parameter.

### Login Page

A client component that renders Google's official OAuth button. When clicked, it calls Supabase's `signInWithOAuth()` method, passing the redirect URL with the smart redirect parameter. The redirect URL points to the application's callback route rather than directly to the destination page.

### Dashboard Page

A server component that fetches the authenticated user's profile from the database. It displays the user's email, account creation date, and current token balance. The dashboard includes a server action for signing out that clears the session and redirects to the login page.

## Integration Points

### Database Schema

The authentication system integrates with the `profiles` table created in the database schema. The auto-trigger creates profile records linked to Supabase Auth's `auth.users` table via UUID foreign key. Row-level security policies ensure users can only access their own profile data.

### Environment Configuration

The system requires two environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. These are public variables safe for client-side use, as they only grant anonymous access. The anon key is used for all authentication operations.

### Existing Pages

The `/generate` route is now protected by middleware and requires authentication. Users who previously accessed this page anonymously will now be prompted to sign in first. The redirect system preserves any template selection in the URL query parameters.

### Cookie Management

Supabase uses three cookies for session management: access token, refresh token, and user metadata. The middleware ensures these cookies are properly set on the response and read from the request on each navigation. Cookies are HTTP-only and secure in production.
