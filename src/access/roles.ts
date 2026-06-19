import type { Access } from 'payload'

export const isAdmin: Access = ({ req }) => {
  return req.user?.role === 'admin'
}

export const isFarm: Access = ({ req }) => {
  return req.user?.role === 'farm'
}

export const isCustomer: Access = ({ req }) => {
  return req.user?.role === 'customer'
}

export const anyone: Access = () => true

export const authenticated: Access = ({ req }) => {
  return Boolean(req.user)
}
