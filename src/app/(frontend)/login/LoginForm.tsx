'use client'

import { useActionState } from 'react'
import { loginAction } from './actions'

const initialState = {
  error: '',
  email: '',
}

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState)

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        defaultValue={state.email}
        className="h-14 w-full rounded-lg border px-4"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className="h-14 w-full rounded-lg border px-4"
      />

      <button
        disabled={pending}
        className="h-14 w-full rounded-lg bg-primary font-medium text-white disabled:opacity-50"
      >
        {pending ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
