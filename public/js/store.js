import { formatLocation } from './locations.js'

const DB_KEY = 'somaiya-lost-found-db'

let seedPromise

async function loadSeed() {
  if (!seedPromise) {
    seedPromise = fetch('/js/seed-data.json').then((r) => r.json())
  }
  return seedPromise
}

function cloneDb(db) {
  return JSON.parse(JSON.stringify(db))
}

export async function loadDb() {
  const raw = localStorage.getItem(DB_KEY)
  if (raw) return JSON.parse(raw)
  const seed = await loadSeed()
  saveDb(seed)
  return cloneDb(seed)
}

export function saveDb(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
}

export function nextReportId(db) {
  db.reportSeq += 1
  const year = new Date().getFullYear()
  return `LF-${year}-${String(db.reportSeq).padStart(5, '0')}`
}

export function nextClaimId(db) {
  db.claimSeq += 1
  const year = new Date().getFullYear()
  return `CL-${year}-${String(db.claimSeq).padStart(5, '0')}`
}

function fail(message) {
  const err = new Error(message)
  throw err
}

export async function login(email, password) {
  const normalized = String(email || '').trim().toLowerCase()
  if (!normalized.endsWith('@somaiya.edu')) {
    fail('Please use your college email (e.g. student@somaiya.edu).')
  }
  if (!password || String(password).length < 4) {
    fail('Invalid password.')
  }
  const db = await loadDb()
  let user = db.users.find((u) => u.email.toLowerCase() === normalized)
  if (!user) {
    if (normalized.includes('admin')) {
      user = db.users.find((u) => u.role === 'admin')
    } else {
      user = {
        id: `u-${Date.now()}`,
        name: normalized.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        email: normalized,
        role: 'student',
      }
      db.users.push(user)
      saveDb(db)
    }
  }
  if (!user) fail('User not found.')
  return { user }
}

export async function register(name, email, password) {
  const normalized = String(email || '').trim().toLowerCase()
  if (!normalized.endsWith('@somaiya.edu')) {
    fail('Registration requires a @somaiya.edu email.')
  }
  if (!password || String(password).length < 6) {
    fail('Password must be at least 6 characters.')
  }
  const db = await loadDb()
  const user = {
    id: `u-${Date.now()}`,
    name: String(name || '').trim(),
    email: normalized,
    role: 'student',
  }
  db.users.push(user)
  saveDb(db)
  return { user }
}

export async function listItems(params = {}) {
  const db = await loadDb()
  let items = [...db.items]
  const { type, userId, search, category, building, floor, date, status, foundOnly } = params

  if (type) items = items.filter((i) => i.type === type)
  if (userId) items = items.filter((i) => i.studentId === userId)
  if (foundOnly === '1') {
    items = items.filter(
      (i) => i.type === 'found' && !['rejected', 'completed', 'claimed'].includes(i.status),
    )
  }
  if (search) {
    const q = String(search).toLowerCase()
    items = items.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q),
    )
  }
  if (category) items = items.filter((i) => i.category === category)
  if (building) items = items.filter((i) => i.location?.building === building)
  if (floor) items = items.filter((i) => i.location?.floor === floor)
  if (date) items = items.filter((i) => i.date === date)
  if (status) items = items.filter((i) => i.status === status)
  return items
}

export async function getItem(id) {
  const db = await loadDb()
  const item = db.items.find((i) => i.id === id)
  if (!item) fail('Not found')
  return item
}

export async function createItem(body) {
  const db = await loadDb()
  const item = {
    ...body,
    id: `item-${Date.now()}`,
    reportId: nextReportId(db),
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  db.items.push(item)
  saveDb(db)
  return item
}

export async function setItemStatus(id, status) {
  const db = await loadDb()
  const idx = db.items.findIndex((i) => i.id === id)
  if (idx === -1) fail('Not found')
  db.items[idx].status = status
  saveDb(db)
  return db.items[idx]
}

export async function listClaims(userId) {
  const db = await loadDb()
  let claims = [...db.claims]
  if (userId) claims = claims.filter((c) => c.userId === userId)
  return claims
}

export async function createClaim(body) {
  const db = await loadDb()
  const claim = {
    ...body,
    id: `claim-${Date.now()}`,
    claimId: nextClaimId(db),
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  db.claims.push(claim)
  saveDb(db)
  return claim
}

export async function setClaimStatus(id, status, rejectReason) {
  const db = await loadDb()
  const idx = db.claims.findIndex((c) => c.id === id)
  if (idx === -1) fail('Not found')
  db.claims[idx].status = status
  if (rejectReason) db.claims[idx].rejectReason = rejectReason
  saveDb(db)
  return db.claims[idx]
}

export async function approveClaim(id) {
  const db = await loadDb()
  const idx = db.claims.findIndex((c) => c.id === id)
  if (idx === -1) fail('Not found')
  const claim = db.claims[idx]
  claim.status = 'approved'
  const itemIdx = db.items.findIndex((i) => i.id === claim.itemId)
  if (itemIdx !== -1) db.items[itemIdx].status = 'claimed'
  const item = db.items[itemIdx]
  db.transactions.push({
    id: `tx-${Date.now()}`,
    itemId: claim.itemId,
    itemName: claim.itemName,
    foundBy: item?.studentName ?? 'Unknown',
    foundById: item?.studentId ?? '',
    claimedBy: claim.userName,
    claimedById: claim.userId,
    location: item ? formatLocation(item.location) : claim.lastSeenLocation,
    status: 'ready_for_handover',
    updatedAt: new Date().toISOString(),
  })
  saveDb(db)
  return claim
}

export async function rejectClaim(id, reason) {
  const db = await loadDb()
  const idx = db.claims.findIndex((c) => c.id === id)
  if (idx === -1) fail('Not found')
  db.claims[idx].status = 'rejected'
  db.claims[idx].rejectReason = reason || 'Rejected by admin'
  saveDb(db)
  return db.claims[idx]
}

export async function listTransactions() {
  const db = await loadDb()
  return db.transactions
}

export async function updateTransaction(id, status) {
  const db = await loadDb()
  const idx = db.transactions.findIndex((t) => t.id === id)
  if (idx === -1) fail('Not found')
  db.transactions[idx].status = status
  db.transactions[idx].updatedAt = new Date().toISOString()
  if (status === 'completed') {
    const itemIdx = db.items.findIndex((i) => i.id === db.transactions[idx].itemId)
    if (itemIdx !== -1) db.items[itemIdx].status = 'completed'
    const claim = db.claims.find((c) => c.itemId === db.transactions[idx].itemId)
    if (claim) claim.status = 'completed'
  }
  saveDb(db)
  return db.transactions[idx]
}

export async function listNotifications(userId) {
  const db = await loadDb()
  return userId ? db.notifications.filter((n) => n.userId === userId) : db.notifications
}

export async function markNotificationRead(id) {
  const db = await loadDb()
  const n = db.notifications.find((x) => x.id === id)
  if (n) n.read = true
  saveDb(db)
  return { ok: true }
}

export async function listUsers() {
  const db = await loadDb()
  return db.users
}

export async function adminStats() {
  const db = await loadDb()
  const items = db.items
  const claims = db.claims
  const lost = items.filter((i) => i.type === 'lost')
  const found = items.filter((i) => i.type === 'found')
  const byBuilding = {}
  const byCategory = {}
  items.forEach((i) => {
    const b = i.location?.building || 'Unknown'
    byBuilding[b] = (byBuilding[b] || 0) + 1
    byCategory[i.category] = (byCategory[i.category] || 0) + 1
  })
  const recovered = items.filter((i) => i.status === 'completed')
  return {
    totalReports: items.length,
    lostCount: lost.length,
    foundCount: found.length,
    pendingClaims: claims.filter((c) => ['pending', 'under_review'].includes(c.status)).length,
    recoveredCount: recovered.length,
    pendingApprovals: found.filter((i) => i.status === 'pending').length,
    recoveryRate: lost.length ? Math.round((recovered.length / lost.length) * 100) : 0,
    byBuilding,
    byCategory,
  }
}
