const CACHE = 'p2i-v1'

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(['/', '/index.html']))
  )
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  )
})

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone()
        caches.open(CACHE).then(c => c.put(e.request, clone))
        return res
      })
      .catch(() => caches.match(e.request))
  )
})

self.addEventListener('sync', e => {
  if (e.tag === 'sync-surveys') e.waitUntil(syncSurveys())
})

async function syncSurveys() {
  const db = await new Promise((res, rej) => {
    const r = indexedDB.open('p2i-offline', 1)
    r.onsuccess = () => res(r.result)
    r.onerror = () => rej(r.error)
  })
  const items = await new Promise(res => {
    const tx = db.transaction('surveys', 'readonly')
    const req = tx.objectStore('surveys').getAll()
    req.onsuccess = () => res(req.result)
  })
  for (const item of items) {
    try {
      await fetch('/api/survey/upload', { method: 'POST', body: item.data })
      await new Promise(res => {
        const tx = db.transaction('surveys', 'readwrite')
        tx.objectStore('surveys').delete(item.id)
        tx.oncomplete = res
      })
    } catch { /* retry next sync */ }
  }
}
