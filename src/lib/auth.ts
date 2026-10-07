import { supabase } from './supabase';

function getAppUrl() {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    'http://localhost:3000'
  );
}

export async function signUp(
  email: string,
  password: string,
  firstName: string
) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        `${getAppUrl()}/auth/callback`,
      data: {
        first_name: firstName
      }
    }
  });
}

export async function resendSignupConfirmation(
  email: string
) {
  return supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo:
        `${getAppUrl()}/auth/callback`
    }
  });
}

export async function signIn(
  email: string,
  password: string
) {
  return supabase.auth.signInWithPassword({
    email,
    password
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function sendPasswordReset(
  email: string
) {
  return supabase.auth.resetPasswordForEmail(
    email,
    {
      redirectTo:
        `${getAppUrl()}/reset-password`
    }
  );
}