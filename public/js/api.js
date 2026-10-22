import * as store from './store.js'

export async function api(_path, _options = {}) {
  throw new Error('Direct API calls are not used in the frontend-only app.')
}

export const authApi = {
  login: (email, password) => store.login(email, password),
  register: (name, email, password) => store.register(name, email, password),
}

export const itemsApi = {
  list: (params = {}) => store.listItems(params),
  get: (id) => store.getItem(id),
  create: (body) => store.createItem(body),
  setStatus: (id, status) => store.setItemStatus(id, status),
}

export const claimsApi = {
  list: (userId) => store.listClaims(userId),
  create: (body) => store.createClaim(body),
  setStatus: (id, status) => store.setClaimStatus(id, status),
  approve: (id) => store.approveClaim(id),
  reject: (id, reason) => store.rejectClaim(id, reason),
}

export const txApi = {
  list: () => store.listTransactions(),
  update: (id, status) => store.updateTransaction(id, status),
}

export const notifApi = {
  list: (userId) => store.listNotifications(userId),
  read: (id) => store.markNotificationRead(id),
}

export const adminApi = {
  stats: () => store.adminStats(),
  users: () => store.listUsers(),
}
