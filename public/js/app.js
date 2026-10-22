import { adminApi, authApi, claimsApi, itemsApi, notifApi, txApi } from './api.js'
import { getUser, logout, setUser } from './auth.js'
import { BUILDINGS, CATEGORIES, FLOORS_BY_BUILDING, formatLocation } from './locations.js'
import { escapeHtml, formatDate, formatDateTime } from './utils.js'
import {
  bindDashboardLayout, bindLocationBox, brandLogo, dashboardLayout,
  itemCard, locationFieldsHtml, opts, showToast, statusBadge,
} from './ui.js'

const app = document.getElementById('app')

function navigate(path) {
  history.pushState({}, '', path)
  render()
}

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="/"]')
  if (a && a.getAttribute('href').startsWith('/') && !a.hasAttribute('data-external')) {
    e.preventDefault()
    navigate(a.getAttribute('href'))
  }
})
window.addEventListener('popstate', render)

function requireAuth(role) {
  const user = getUser()
  if (!user) {
    navigate('/login')
    return null
  }
  if (role && user.role !== role) {
    navigate(user.role === 'admin' ? '/admin' : '/student')
    return null
  }
  return user
}

async function render() {
  const path = location.pathname.replace(/\/$/, '') || '/'
  app.innerHTML = '<div class="loading">Loading…</div>'

  try {
    if (path === '/') return renderLanding()
    if (path === '/login') return renderLogin()
    if (path === '/register') return renderRegister()

    if (path.startsWith('/student')) {
      const user = requireAuth('student')
      if (!user) return
      if (path === '/student') return renderStudentHome(user)
      if (path === '/student/lost') return renderReportLost(user)
      if (path === '/student/found') return renderReportFound(user)
      if (path === '/student/search') return renderSearch(user)
      if (path === '/student/reports') return renderReports(user)
      if (path === '/student/claims') return renderClaims(user)
      if (path === '/student/notifications') return renderNotifications(user)
      if (path === '/student/profile') return renderProfile(user)
      const m = path.match(/^\/student\/item\/(.+)$/)
      if (m) return renderItemDetail(user, m[1])
      return navigate('/student')
    }

    if (path.startsWith('/admin')) {
      const user = requireAuth('admin')
      if (!user) return
      if (path === '/admin') return renderAdminHome(user)
      if (path === '/admin/items') return renderAdminItems(user)
      if (path === '/admin/lost') return renderAdminLost(user)
      if (path === '/admin/claims') return renderAdminClaims(user)
      if (path === '/admin/users') return renderAdminUsers(user)
      if (path === '/admin/transactions') return renderAdminTx(user)
      if (path === '/admin/analytics') return renderAdminAnalytics(user)
      if (path === '/admin/settings') return renderAdminSettings(user)
      return navigate('/admin')
    }

    navigate('/')
  } catch (err) {
    app.innerHTML = `<div class="card"><p>Error: ${escapeHtml(err.message)}</p></div>`
    showToast(err.message, 'error')
  }
}

function mountDash(role, path, title, html, user) {
  app.innerHTML = dashboardLayout(role, path, title, html, user)
  bindDashboardLayout(() => {
    logout()
    showToast('Logged out')
    navigate('/login')
  })
}

async function renderLanding() {
  const items = await itemsApi.list({ foundOnly: '1' })
  const recent = items.slice(0, 4)
  app.innerHTML = `
    <header class="public-header">${brandLogo('/')}
      <div><a href="/login" class="btn btn-primary btn-sm">Login</a></div>
    </header>
    <section class="hero"><div class="hero-inner">
      <p style="color:#fecaca;font-size:13px;text-transform:uppercase;letter-spacing:.08em">Somaiya University Campus</p>
      <h1>Lost it? Found it? We've got you covered.</h1>
      <p>A centralized Lost &amp; Found platform designed for the Somaiya University campus.</p>
      <div class="hero-actions">
        <a href="/login" class="btn btn-primary">Report Lost Item</a>
        <a href="/login" class="btn btn-outline btn-light">Report Found Item</a>
      </div>
    </div></section>
    <section class="section">
      <h2>How It Works</h2>
      <p style="color:var(--muted)">Report → Search → Claim → Admin Verify → Handover → Recover</p>
      <div class="grid-4" style="margin-top:24px">
        ${['Report', 'Search', 'Claim & Verify', 'Recover'].map((t) => `<div class="card"><strong>${t}</strong></div>`).join('')}
      </div>
    </section>
    <section class="section" style="padding-top:0">
      <h2>Recent Found Items</h2>
      <div class="grid-4">${recent.map((i) => itemCard(i, '/login')).join('')}</div>
    </section>
    <footer class="footer"><div class="footer-inner">${brandLogo('/', true)}
      <small>© ${new Date().getFullYear()} Somaiya University — Mini Project</small></div></footer>`
}

function renderLogin() {
  if (getUser()) return navigate(getUser().role === 'admin' ? '/admin' : '/student')
  app.innerHTML = `<div class="auth-wrap"><div class="auth-card">
    ${brandLogo('/')}
    <div class="card" style="margin-top:24px">
      <h1>Sign in</h1>
      <form id="login-form">
        <label>College Email<input type="email" name="email" required placeholder="student@somaiya.edu"></label>
        <label>Password<input type="password" name="password" required minlength="4"></label>
        <button class="btn btn-primary btn-block" type="submit">Login</button>
      </form>
      <p style="font-size:14px;color:var(--muted);text-align:center;margin-top:16px">
        <a href="/register" style="color:var(--red)">Register</a></p>
      <p style="font-size:12px;background:#f9fafb;padding:12px;border-radius:8px;margin-top:12px">
        Demo: student@somaiya.edu or admin@somaiya.edu (password 4+ chars)</p>
    </div></div></div>`
  document.getElementById('login-form').onsubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    try {
      const { user } = await authApi.login(fd.get('email'), fd.get('password'))
      setUser(user)
      showToast('Welcome back!', 'success')
      navigate(user.role === 'admin' ? '/admin' : '/student')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }
}

function renderRegister() {
  app.innerHTML = `<div class="auth-wrap"><div class="auth-card">
    ${brandLogo('/')}
    <div class="card" style="margin-top:24px">
      <h1>Create account</h1>
      <form id="reg-form">
        <label>Full Name<input name="name" required></label>
        <label>College Email<input type="email" name="email" required placeholder="student@somaiya.edu"></label>
        <label>Password<input type="password" name="password" required minlength="6"></label>
        <button class="btn btn-primary btn-block" type="submit">Register</button>
      </form>
      <p style="text-align:center;margin-top:16px;font-size:14px"><a href="/login" style="color:var(--red)">Login</a></p>
    </div></div></div>`
  document.getElementById('reg-form').onsubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    try {
      const { user } = await authApi.register(fd.get('name'), fd.get('email'), fd.get('password'))
      setUser(user)
      navigate('/student')
    } catch (err) {
      showToast(err.message, 'error')
    }
  }
}

async function renderStudentHome(user) {
  const [items, claims, notifs] = await Promise.all([
    itemsApi.list({ userId: user.id }),
    claimsApi.list(user.id),
    notifApi.list(user.id),
  ])
  const html = `
    <p>Welcome, <strong>${escapeHtml(user.name.split(' ')[0])}</strong></p>
    <div class="grid-4">
      <div class="stat-card"><span>My Lost Items</span><strong>${items.filter((i) => i.type === 'lost').length}</strong></div>
      <div class="stat-card"><span>My Found Items</span><strong>${items.filter((i) => i.type === 'found').length}</strong></div>
      <div class="stat-card"><span>Active Claims</span><strong>${claims.filter((c) => !['completed', 'rejected'].includes(c.status)).length}</strong></div>
      <div class="stat-card"><span>Recovered</span><strong>${items.filter((i) => ['completed', 'matched'].includes(i.status)).length}</strong></div>
    </div>
    <div class="card" style="margin-top:24px"><h3>Recent Activity</h3>
      <ul>${notifs.slice(0, 5).map((n) => `<li>${escapeHtml(n.message)}</li>`).join('') || '<li class="empty">No activity yet.</li>'}</ul>
    </div>`
  mountDash('student', '/student', 'Student Dashboard', html, user)
}

function reportForm(type, user, onSuccess) {
  const title = type === 'found' ? 'Report a Found Item' : 'Report a Lost Item'
  const html = `
    <h2>${title}</h2>
    <form id="report-form" class="card">
      <label>Item Name *<input name="name" required></label>
      <label>Category *<select name="category" required>${opts(CATEGORIES, '', 'Select')}</select></label>
      <label>Description *<textarea name="description" rows="3" required></textarea></label>
      <label>Date *<input type="date" name="date" required></label>
      <label>Time<input type="time" name="time"></label>
      ${locationFieldsHtml({}, 'r')}
      <label>Additional Info<textarea name="additionalInfo" rows="2"></textarea></label>
      <button class="btn btn-primary" type="submit">Submit</button>
    </form>`
  mountDash('student', `/student/${type === 'found' ? 'found' : 'lost'}`, title, html, user)
  const readLoc = bindLocationBox(document.querySelector('[data-loc-root="r"]'))
  document.getElementById('report-form').onsubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const location = readLoc()
    if (!location.building || (!location.commonLocation && !location.floor)) {
      showToast('Please select a building and location.', 'error')
      return
    }
    await itemsApi.create({
      type,
      name: fd.get('name'),
      category: fd.get('category'),
      description: fd.get('description'),
      date: fd.get('date'),
      time: fd.get('time') || undefined,
      location,
      additionalInfo: fd.get('additionalInfo') || undefined,
      studentId: user.id,
      studentName: user.name,
    })
    onSuccess()
  }
}

function renderReportFound(user) {
  reportForm('found', user, () => {
    showToast('Found item reported successfully.', 'success')
    mountDash('student', '/student/found', 'Success', `<div class="card"><h2>Found item reported successfully.</h2><p>Status: ${statusBadge('pending')} Pending Admin Approval</p><a href="/student/found" class="btn btn-primary" style="margin-top:16px">Report Another</a></div>`, user)
  })
}

function renderReportLost(user) {
  reportForm('lost', user, () => {
    showToast('Lost item reported successfully.', 'success')
    mountDash('student', '/student/lost', 'Success', `<div class="card"><h2>Your lost item has been added successfully.</h2><a href="/student/search" class="btn btn-primary" style="margin-top:16px">Search Found Items</a></div>`, user)
  })
}

async function renderSearch(user) {
  const items = await itemsApi.list({ foundOnly: '1' })
  const html = `
    <h2>Search Found Items</h2>
    <input id="q" placeholder="Search for an item..." style="margin-bottom:16px">
    <div class="grid-4" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr));margin-bottom:16px">
      <select id="f-cat"><option value="">Category</option>${opts(CATEGORIES)}</select>
      <select id="f-bld"><option value="">Building</option>${opts(BUILDINGS)}</select>
      <select id="f-floor"><option value="">Floor</option></select>
      <select id="f-status"><option value="">Status</option><option value="verified">Verified</option><option value="pending">Pending</option></select>
    </div>
    <div id="results" class="grid-4">${items.map((i) => itemCard(i)).join('')}</div>`
  mountDash('student', '/student/search', 'Search', html, user)

  const run = async () => {
    const list = await itemsApi.list({
      foundOnly: '1',
      search: document.getElementById('q').value,
      category: document.getElementById('f-cat').value,
      building: document.getElementById('f-bld').value,
      floor: document.getElementById('f-floor').value,
      status: document.getElementById('f-status').value,
    })
    document.getElementById('results').innerHTML = list.length
      ? list.map((i) => itemCard(i)).join('')
      : '<div class="empty">No items match your search.</div>'
  }
  document.getElementById('q').oninput = run
  document.getElementById('f-cat').onchange = run
  document.getElementById('f-bld').onchange = (e) => {
    const floors = FLOORS_BY_BUILDING[e.target.value] || []
    document.getElementById('f-floor').innerHTML = `<option value="">Floor</option>${opts(floors)}`
    run()
  }
  document.getElementById('f-floor').onchange = run
  document.getElementById('f-status').onchange = run
}

async function renderItemDetail(user, id) {
  const item = await itemsApi.get(id)
  const html = `
    ${item.imageUrl ? `<div class="item-detail-img"><img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.name)}"></div>` : ''}
    <div class="card">
      <h1>${escapeHtml(item.name)}</h1> ${statusBadge(item.status)}
      <p><strong>${escapeHtml(item.category)}</strong></p>
      <p>${escapeHtml(item.description)}</p>
      <p>Found: ${formatDate(item.date)}</p>
      <p>Location: ${escapeHtml(formatLocation(item.location))}</p>
      <p>Report ID: <code>${escapeHtml(item.reportId)}</code></p>
      ${item.type === 'found' && !['claimed', 'completed'].includes(item.status) ? '<button class="btn btn-primary" id="claim-btn">This Is My Item</button>' : ''}
    </div>
    <div id="claim-modal"></div>`
  mountDash('student', `/student/item/${id}`, item.name, html, user)
  document.getElementById('claim-btn')?.addEventListener('click', () => {
    document.getElementById('claim-modal').innerHTML = `
      <div class="modal-backdrop" id="cm"><div class="modal">
        <h2>Claim This Item</h2>
        <form id="claim-form">
          <label>Why is this yours?<textarea name="reason" required rows="2"></textarea></label>
          <label>Unique feature<textarea name="uniqueFeature" required rows="2"></textarea></label>
          <label>Lost date<input type="date" name="lostDate" required></label>
          <label>Last seen location<input name="lastSeenLocation" required></label>
          <button class="btn btn-primary" type="submit">Submit Claim</button>
        </form>
      </div></div>`
    document.getElementById('cm').onclick = (ev) => { if (ev.target.id === 'cm') ev.target.innerHTML = '' }
    document.getElementById('claim-form').onsubmit = async (ev) => {
      ev.preventDefault()
      const fd = new FormData(ev.target)
      await claimsApi.create({
        itemId: item.id,
        itemName: item.name,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        reason: fd.get('reason'),
        uniqueFeature: fd.get('uniqueFeature'),
        lostDate: fd.get('lostDate'),
        lastSeenLocation: fd.get('lastSeenLocation'),
      })
      showToast('Claim submitted. Pending admin verification.', 'success')
      navigate('/student/claims')
    }
  })
}

async function renderReports(user) {
  const items = await itemsApi.list({ userId: user.id })
  const block = (title, list) => `
    <div class="card" style="margin-bottom:16px"><h3>${title}</h3>
      ${list.length ? list.map((i) => `<div style="padding:12px 0;border-bottom:1px solid #f3f4f6">
        <strong>${escapeHtml(i.name)}</strong> ${statusBadge(i.status)}
        <div style="font-size:12px;color:var(--muted)">${escapeHtml(i.reportId)} · ${formatLocation(i.location)}</div>
        <a href="/student/item/${i.id}" style="color:var(--red);font-size:13px">View</a>
      </div>`).join('') : '<p class="empty">No items yet.</p>'}
    </div>`
  mountDash('student', '/student/reports', 'My Reports', block('Lost Items', items.filter((i) => i.type === 'lost')) + block('Found Items', items.filter((i) => i.type === 'found')), user)
}

async function renderClaims(user) {
  const claims = await claimsApi.list(user.id)
  const rows = claims.map((c) => `<tr>
    <td>${escapeHtml(c.itemName)}</td><td>${escapeHtml(c.claimId)}</td><td>${formatDate(c.createdAt)}</td>
    <td>${statusBadge(c.status)}</td><td><a href="/student/item/${c.itemId}">View</a></td></tr>`).join('')
  mountDash('student', '/student/claims', 'My Claims', `
    <div class="table-wrap"><table><thead><tr><th>Item</th><th>Claim ID</th><th>Date</th><th>Status</th><th></th></tr></thead>
    <tbody>${rows || '<tr><td colspan="5">No claims yet.</td></tr>'}</tbody></table></div>`, user)
}

async function renderNotifications(user) {
  const notifs = await notifApi.list(user.id)
  mountDash('student', '/student/notifications', 'Notifications', notifs.map((n) => `
    <div class="card" style="margin-bottom:8px;${n.read ? '' : 'border-color:#fecaca;background:#fef2f2'}">
      <p>${escapeHtml(n.message)}</p><small>${formatDateTime(n.createdAt)}</small>
    </div>`).join('') || '<div class="empty">No notifications.</div>', user)
}

function renderProfile(user) {
  mountDash('student', '/student/profile', 'Profile', `<div class="card">
    <p><strong>Name:</strong> ${escapeHtml(user.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(user.email)}</p>
    <p><strong>Role:</strong> ${escapeHtml(user.role)}</p></div>`, user)
}

async function renderAdminHome(user) {
  const s = await adminApi.stats()
  mountDash('admin', '/admin', 'Admin Dashboard', `<div class="grid-4">
    ${[['Total Reports', s.totalReports], ['Lost', s.lostCount], ['Found', s.foundCount], ['Pending Claims', s.pendingClaims], ['Recovered', s.recoveredCount], ['Pending Approvals', s.pendingApprovals]]
      .map(([t, v]) => `<div class="stat-card"><span>${t}</span><strong>${v}</strong></div>`).join('')}
  </div>`, user)
}

async function renderAdminItems(user) {
  const items = await itemsApi.list({ type: 'found' })
  mountDash('admin', '/admin/items', 'Reported Items', `
    <div class="table-wrap"><table><thead><tr>
      <th>ID</th><th>Item</th><th>Student</th><th>Status</th><th>Actions</th>
    </tr></thead><tbody>${items.map((i) => `<tr>
      <td>${escapeHtml(i.reportId)}</td><td>${escapeHtml(i.name)}</td><td>${escapeHtml(i.studentName)}</td>
      <td>${statusBadge(i.status)}</td>
      <td>${i.status === 'pending' ? `<button data-ok="${i.id}" class="btn btn-sm btn-primary">Approve</button>
        <button data-no="${i.id}" class="btn btn-sm btn-danger">Reject</button>` : ''}</td>
    </tr>`).join('')}</tbody></table></div>`, user)
  app.querySelectorAll('[data-ok]').forEach((b) => b.onclick = async () => {
    await itemsApi.setStatus(b.dataset.ok, 'verified')
    showToast('Approved', 'success')
    renderAdminItems(user)
  })
  app.querySelectorAll('[data-no]').forEach((b) => b.onclick = async () => {
    await itemsApi.setStatus(b.dataset.no, 'rejected')
    showToast('Rejected', 'info')
    renderAdminItems(user)
  })
}

async function renderAdminLost(user) {
  const items = await itemsApi.list({ type: 'lost' })
  mountDash('admin', '/admin/lost', 'Lost Items', `<div class="table-wrap"><table>
    <thead><tr><th>ID</th><th>Item</th><th>Student</th><th>Location</th><th>Status</th></tr></thead>
    <tbody>${items.map((i) => `<tr><td>${i.reportId}</td><td>${escapeHtml(i.name)}</td><td>${escapeHtml(i.studentName)}</td>
    <td>${escapeHtml(formatLocation(i.location))}</td><td>${statusBadge(i.status)}</td></tr>`).join('')}</tbody></table></div>`, user)
}

async function renderAdminClaims(user) {
  const claims = await claimsApi.list()
  mountDash('admin', '/admin/claims', 'Claims', claims.map((c) => `
    <div class="card" style="margin-bottom:12px" data-id="${c.id}">
      <strong>${escapeHtml(c.itemName)}</strong> — ${escapeHtml(c.userName)} ${statusBadge(c.status)}
      <p style="font-size:13px">${escapeHtml(c.reason)}</p>
      ${['pending', 'under_review'].includes(c.status) ? `
        <button class="btn btn-sm btn-primary" data-approve="${c.id}">Approve</button>
        <button class="btn btn-sm btn-danger" data-reject="${c.id}">Reject</button>` : ''}
    </div>`).join('') || '<div class="empty">No claims.</div>', user)

  app.querySelectorAll('[data-approve]').forEach((b) => b.onclick = async () => {
    await claimsApi.approve(b.dataset.approve)
    showToast('Claim approved. Handover can proceed.', 'success')
    renderAdminClaims(user)
  })
  app.querySelectorAll('[data-reject]').forEach((b) => b.onclick = async () => {
    const reason = prompt('Rejection reason:')
    if (!reason) return
    await claimsApi.reject(b.dataset.reject, reason)
    showToast('Claim rejected', 'info')
    renderAdminClaims(user)
  })
}

async function renderAdminUsers(user) {
  const users = await adminApi.users()
  mountDash('admin', '/admin/users', 'Users', `<div class="table-wrap"><table>
    <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
    <tbody>${users.map((u) => `<tr><td>${escapeHtml(u.name)}</td><td>${escapeHtml(u.email)}</td><td>${u.role}</td></tr>`).join('')}</tbody>
  </table></div>`, user)
}

async function renderAdminTx(user) {
  const txs = await txApi.list()
  mountDash('admin', '/admin/transactions', 'Transactions', txs.map((t) => `
    <div class="card" style="margin-bottom:12px">
      <h3>${escapeHtml(t.itemName)}</h3> ${statusBadge(t.status)}
      <p>Found by: ${escapeHtml(t.foundBy)} · Claimed by: ${escapeHtml(t.claimedBy)}</p>
      <p>${escapeHtml(t.location)}</p>
      ${t.status !== 'completed' ? `<button data-sch="${t.id}" class="btn btn-sm">Schedule</button>
        <button data-done="${t.id}" class="btn btn-sm btn-primary">Complete Handover</button>` : '<strong style="color:green">Recovered Successfully</strong>'}
    </div>`).join('') || '<div class="empty">No transactions yet. Approve a claim first.</div>', user)
  app.querySelectorAll('[data-sch]').forEach((b) => b.onclick = async () => {
    await txApi.update(b.dataset.sch, 'scheduled')
    renderAdminTx(user)
  })
  app.querySelectorAll('[data-done]').forEach((b) => b.onclick = async () => {
    await txApi.update(b.dataset.done, 'completed')
    showToast('Recovered successfully', 'success')
    renderAdminTx(user)
  })
}

async function renderAdminAnalytics(user) {
  const s = await adminApi.stats()
  const bHtml = Object.entries(s.byBuilding).map(([n, c]) => {
    const pct = (c / Math.max(...Object.values(s.byBuilding))) * 100
    return `<li><div style="display:flex;justify-content:space-between"><span>${n}</span><span>${c}</span></div><div class="bar"><span style="width:${pct}%"></span></div></li>`
  }).join('')
  mountDash('admin', '/admin/analytics', 'Analytics', `
    <div class="grid-4"><div class="stat-card"><span>Recovery Rate</span><strong>${s.recoveryRate}%</strong></div></div>
    <div class="card" style="margin-top:16px"><h3>By Building</h3><ul style="list-style:none;padding:0">${bHtml}</ul></div>`, user)
}

function renderAdminSettings(user) {
  mountDash('admin', '/admin/settings', 'Settings', '<div class="card"><p>Campus settings and notification preferences (frontend demo).</p></div>', user)
}

render()
