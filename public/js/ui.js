import { escapeHtml, statusLabel } from './utils.js'
import {
  BUILDINGS, COMMON_LOCATIONS, FLOORS_BY_BUILDING, formatLocation, getClassroomsForFloor,
} from './locations.js'

export function showToast(message, type = 'info') {
  const root = document.getElementById('toast-root')
  const el = document.createElement('div')
  el.className = `toast toast-${type}`
  el.textContent = message
  root.appendChild(el)
  setTimeout(() => el.remove(), 4000)
}

export function statusBadge(status) {
  const s = String(status).toLowerCase().replace(/\s/g, '_')
  return `<span class="badge badge-${escapeHtml(s)}">${escapeHtml(statusLabel(status))}</span>`
}

export function brandLogo(home = '/', light = false) {
  return `
    <a href="${home}" class="brand ${light ? 'brand-light' : ''}">
      <span class="brand-mark">S</span>
      <span>
        <strong>Somaiya Lost &amp; Found</strong>
        <small>Somaiya University Campus</small>
      </span>
    </a>`
}

export function opts(values, selected = '', placeholder = 'Select') {
  let html = `<option value="">${escapeHtml(placeholder)}</option>`
  values.forEach((v) => {
    const val = typeof v === 'string' ? v : v.value
    const lab = typeof v === 'string' ? v : v.label
    html += `<option value="${escapeHtml(val)}" ${val === selected ? 'selected' : ''}>${escapeHtml(lab)}</option>`
  })
  return html
}

export function itemCard(item, detailPath) {
  const path = detailPath || `/student/item/${item.id}`
  return `
    <article class="item-card">
      <div class="item-card-img">${item.imageUrl ? `<img src="${item.imageUrl}" alt="">` : '<span class="ph-icon">📦</span>'}</div>
      <div class="item-card-body">
        <div class="item-card-head">
          <h3>${escapeHtml(item.name)}</h3>
          ${statusBadge(item.status)}
        </div>
        <p class="cat">${escapeHtml(item.category)}</p>
        <p class="loc">${escapeHtml(item.location ? formatLocation(item.location) : '')}</p>
        <a class="btn btn-outline btn-sm btn-block" href="${path}">View Details</a>
      </div>
    </article>`
}

export function locationFieldsHtml(loc = {}, id = 'loc') {
  const mode = loc.commonLocation ? 'common' : 'classroom'
  const floors = loc.building ? FLOORS_BY_BUILDING[loc.building] || [] : []
  const rooms = loc.floor ? getClassroomsForFloor(loc.floor) : []
  return `
    <div class="loc-box" data-loc-root="${id}">
      <p class="loc-title">Location</p>
      <div class="loc-tabs">
        <button type="button" class="loc-tab ${mode === 'classroom' ? 'active' : ''}" data-mode="classroom">Building / Room</button>
        <button type="button" class="loc-tab ${mode === 'common' ? 'active' : ''}" data-mode="common">Common Area</button>
      </div>
      <label>Building *<select name="building" required>${opts(BUILDINGS, loc.building || '', 'Select building')}</select></label>
      <div class="loc-classroom ${mode === 'common' ? 'hidden' : ''}">
        <label>Floor *<select name="floor">${opts(floors.map((f) => ({ value: f, label: f === 'Ground' ? 'Ground Floor' : `${f} Floor` })), loc.floor || '', 'Select floor')}</select></label>
        <label>Room / Classroom<select name="classroom">${opts(rooms, loc.classroom || '', 'Optional')}</select></label>
        <label>Specific Location<input name="specificLocation" value="${escapeHtml(loc.specificLocation || '')}" placeholder="Near lift, corridor..."></label>
      </div>
      <div class="loc-common ${mode === 'classroom' ? 'hidden' : ''}">
        <label>Common Location *<select name="commonLocation">${opts(COMMON_LOCATIONS, loc.commonLocation || '', 'Select')}</select></label>
      </div>
    </div>`
}

export function bindLocationBox(root) {
  if (!root) return () => ({})
  let mode = root.querySelector('.loc-common:not(.hidden)') ? 'common' : 'classroom'

  const read = () => {
    const building = root.querySelector('[name=building]')?.value || ''
    if (mode === 'common') {
      return { building, floor: '', commonLocation: root.querySelector('[name=commonLocation]')?.value || '' }
    }
    return {
      building,
      floor: root.querySelector('[name=floor]')?.value || '',
      classroom: root.querySelector('[name=classroom]')?.value || undefined,
      specificLocation: root.querySelector('[name=specificLocation]')?.value || undefined,
    }
  }

  const refreshRooms = () => {
    const floor = root.querySelector('[name=floor]')?.value
    const sel = root.querySelector('[name=classroom]')
    if (!sel) return
    const rooms = floor ? getClassroomsForFloor(floor) : []
    sel.innerHTML = opts(rooms, '', 'Optional')
  }

  root.querySelector('[name=building]')?.addEventListener('change', (e) => {
    const floors = FLOORS_BY_BUILDING[e.target.value] || []
    const floorSel = root.querySelector('[name=floor]')
    if (floorSel) floorSel.innerHTML = opts(floors.map((f) => ({ value: f, label: f === 'Ground' ? 'Ground Floor' : `${f} Floor` })), '', 'Select floor')
    refreshRooms()
  })
  root.querySelector('[name=floor]')?.addEventListener('change', refreshRooms)

  root.querySelectorAll('.loc-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      mode = btn.dataset.mode
      root.querySelectorAll('.loc-tab').forEach((b) => b.classList.toggle('active', b === btn))
      root.querySelector('.loc-classroom')?.classList.toggle('hidden', mode !== 'classroom')
      root.querySelector('.loc-common')?.classList.toggle('hidden', mode !== 'common')
    })
  })

  return read
}

const STUDENT_NAV = [
  ['/', 'Dashboard', '/student'],
  ['lost', 'Report Lost', '/student/lost'],
  ['found', 'Report Found', '/student/found'],
  ['search', 'Search Items', '/student/search'],
  ['reports', 'My Reports', '/student/reports'],
  ['claims', 'My Claims', '/student/claims'],
  ['notifications', 'Notifications', '/student/notifications'],
  ['profile', 'Profile', '/student/profile'],
]

const ADMIN_NAV = [
  ['', 'Dashboard', '/admin'],
  ['items', 'Reported Items', '/admin/items'],
  ['lost', 'Lost Items', '/admin/lost'],
  ['claims', 'Claims', '/admin/claims'],
  ['users', 'Users', '/admin/users'],
  ['transactions', 'Transactions', '/admin/transactions'],
  ['analytics', 'Analytics', '/admin/analytics'],
  ['settings', 'Settings', '/admin/settings'],
]

export function dashboardLayout(role, activePath, title, content, user) {
  const nav = role === 'admin' ? ADMIN_NAV : STUDENT_NAV
  const home = role === 'admin' ? '/admin' : '/student'
  const links = nav
    .map(([, label, href]) => {
      const active = activePath === href || (href !== home && activePath.startsWith(href))
      return `<a href="${href}" class="side-link ${active ? 'active' : ''}">${escapeHtml(label)}</a>`
    })
    .join('')

  return `
    <div class="dash">
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-head">${brandLogo(home)}</div>
        <nav class="sidebar-nav">${links}</nav>
        <button type="button" class="side-logout" id="btn-logout">Logout</button>
      </aside>
      <div class="dash-main">
        <header class="dash-top">
          <button type="button" class="menu-btn" id="menu-btn" aria-label="Menu">☰</button>
          <div><h1>${escapeHtml(title)}</h1><p class="sub">${escapeHtml(user?.email || '')}</p></div>
          <a href="${role === 'admin' ? '/admin/settings' : '/student/profile'}" class="avatar">${escapeHtml((user?.name || 'U')[0])}</a>
        </header>
        <main class="dash-content">${content}</main>
      </div>
    </div>`
}

export function bindDashboardLayout(onLogout) {
  document.getElementById('btn-logout')?.addEventListener('click', onLogout)
  document.getElementById('menu-btn')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('open')
  })
}
