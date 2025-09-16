import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/';

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=callback_error`);
      }
    } catch (error) {
      console.error('Auth callback exception:', error);
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=callback_error`);
    }
  }

  // Redirect to the next URL or dashboard
  const redirectUrl = next.startsWith('/') ? `${requestUrl.origin}${next}` : `${requestUrl.origin}/dashboard`;
  return NextResponse.redirect(redirectUrl);
}