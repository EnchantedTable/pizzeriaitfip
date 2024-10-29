// Nombres para la cache
const CACHE_NAME = 'pizza-pwa-v1';
const URLS_TO_CACHE = [
  '/public/index.html', // Página principal
  '/public/index.html',
  '/public/styles.css',
  'manifest.json',
  '/icons/p-192.png', // Icono PWA
  '/icons/p-512.png'
];

// Evento de instalación: Cachea los recursos al instalar el Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Archivos cacheados correctamente');
      return cache.addAll(URLS_TO_CACHE);
    }).catch(error => console.error('Error al cachear:', error))
  );
});

// Evento de activación: Limpia la cache antigua si hay una nueva versión
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Cache antiguo eliminado:', cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Evento fetch: Responde con recursos cacheados o hace una petición a la red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Si el recurso está en cache, lo devuelve; si no, lo pide a la red
      return response || fetch(event.request);
    }).catch(() => caches.match('public/index.html')) // Si todo falla, carga la página principal
  );
});