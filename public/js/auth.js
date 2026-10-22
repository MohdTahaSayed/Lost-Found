const KEY = 'slf_user'

export function getUser() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || 'null')
  } catch {
    return null
  }
}

export function setUser(user) {
  if (user) sessionStorage.setItem(KEY, JSON.stringify(user))
  else sessionStorage.removeItem(KEY)
}

export function logout() {
  setUser(null)
}
