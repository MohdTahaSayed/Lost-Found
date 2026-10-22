export const BUILDINGS = ['Arya Bhatta', 'Bhaskaracharya']

export const FLOORS_BY_BUILDING = {
  'Arya Bhatta': ['Ground', '1st', '2nd', '3rd'],
  Bhaskaracharya: ['Ground', '1st', '2nd', '3rd', '4th', '5th'],
}

export const COMMON_LOCATIONS = [
  'Canteen',
  'Library',
  'Parking',
  'Laboratory',
  'Corridor',
  'Washroom',
  'Auditorium',
  'Sports Ground',
  'Other',
]

const CLASSROOM_NUMBERS = [
  '001', '002', '003', '004', '005', '006',
  '101', '102', '103', '104',
  '201', '202', '203', '204',
]

export function getClassroomsForFloor(floor) {
  if (floor === 'Ground') return CLASSROOM_NUMBERS.filter((n) => n.startsWith('0'))
  const map = { '1st': '1', '2nd': '2', '3rd': '3', '4th': '4', '5th': '5' }
  const prefix = map[floor]
  if (!prefix) return CLASSROOM_NUMBERS
  return CLASSROOM_NUMBERS.filter((n) => n.startsWith(prefix))
}

export function formatLocation(loc) {
  if (!loc) return ''
  if (loc.commonLocation) return `${loc.building} — ${loc.commonLocation}`
  const room = loc.classroom ? ` — Room ${loc.classroom}` : ''
  const specific = loc.specificLocation ? ` (${loc.specificLocation})` : ''
  return `${loc.building} — ${loc.floor} Floor${room}${specific}`
}

export const CATEGORIES = [
  'Electronics', 'Wallet', 'ID Card', 'Keys', 'Books', 'Bags',
  'Clothing', 'Stationery', 'Accessories', 'Other',
]
