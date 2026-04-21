const DB_NAME = 'p2i-offline'
const STORE   = 'surveys'

const openDB = () => new Promise((res, rej) => {
  const r = indexedDB.open(DB_NAME, 1)
  r.onupgradeneeded = e =>
    e.target.result.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true })
  r.onsuccess = e => res(e.target.result)
  r.onerror   = ()  => rej(r.error)
})

export const queueSurvey = async (data) => {
  const db = await openDB()
  return new Promise((res, rej) => {
    const tx  = db.transaction(STORE, 'readwrite')
    const req = tx.objectStore(STORE).add(data)
    req.onsuccess = () => res(req.result)
    req.onerror   = () => rej(req.error)
  })
}

export const getQueue = async () => {
  const db = await openDB()
  return new Promise((res, rej) => {
    const tx  = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).getAll()
    req.onsuccess = () => res(req.result)
    req.onerror   = () => rej(req.error)
  })
}

export const dequeueSurvey = async (id) => {
  const db = await openDB()
  return new Promise((res, rej) => {
    const tx  = db.transaction(STORE, 'readwrite')
    const req = tx.objectStore(STORE).delete(id)
    req.onsuccess = () => res()
    req.onerror   = () => rej(req.error)
  })
}
