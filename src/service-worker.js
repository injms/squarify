const CACHE = 'cache';

const precache = () => {
    return caches.open(CACHE).then( cache => {
      return cache.addAll([
        './index.html',
        './icons/download.svg',
        './icons/rotate.svg',
        './icons/upload.svg',
        './icons/frame.svg',
        './javascript/app.js',
        './javascript/squarify.js'
      ]);
    });
  }

const fromCache = (request) => {
  return caches.open(CACHE)
          .then( cache => {
              return cache.match(request)
                      .then( matching => {
                        return matching || Promise.reject('no-match');
                      })
                      .catch( error => console.log(error) );
          })
          .catch( error => console.log(error) );
}

const update = (request) => {
  if (navigator.onLine) {
    return caches.open(CACHE)
            .then( cache => {
              return fetch(request).then( response => {
                  return cache.put(request, response);
                })
                .catch( error => console.log(error) );
            })
            .catch( error => console.log(error) );
    }
    else {
      return false;
    }
  }

self.addEventListener('install', event => {
    event.waitUntil(precache());
});

self.addEventListener('fetch', event => {
    event.respondWith(fromCache(event.request));
    event.waitUntil(update(event.request));
});
