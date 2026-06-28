'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { registerCustomerAction, registerFarmAction } from './actions'

type Props = {
  isFarm: boolean
}

const initialState = {
  error: '',
  email: '',
  farmName: '',
}

export function RegisterForm({ isFarm }: Props) {
  const action = isFarm ? registerFarmAction : registerCustomerAction
  const [state, formAction, pending] = useActionState(action, initialState)

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <h1 className="md:text-4xl">{isFarm ? 'Create your farm account' : 'Create an account'}</h1>

        <p className="text-base text-muted-foreground md:text-lg">
          {isFarm
            ? 'Set up your farm profile and start listing fresh products.'
            : 'Discover local farms, browse fresh products, and place orders directly.'}
        </p>
      </div>

      {state.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {isFarm && (
        <input
          name="farmName"
          placeholder="Farm name"
          required
          defaultValue={state.farmName}
          className="h-14 w-full rounded-lg border px-4 text-base"
        />
      )}

      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        defaultValue={state.email}
        className="h-14 w-full rounded-lg border px-4 text-base"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        required
        className="h-14 w-full rounded-lg border px-4 text-base"
      />

      <button
        disabled={pending}
        className="h-14 w-full rounded-lg bg-primary text-base font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? 'Creating account...' : isFarm ? 'Create farm account' : 'Create account'}
      </button>

      <div className="space-y-2 text-center text-sm">
        <p className="text-muted-foreground">
          {isFarm ? (
            <>
              Want to buy from local farms?{' '}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Register as a customer
              </Link>
            </>
          ) : (
            <>
              Own a farm?{' '}
              <Link href="/register?type=farm" className="font-medium text-primary hover:underline">
                Register your farm
              </Link>
            </>
          )}
        </p>

        <p className="text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  )
}
