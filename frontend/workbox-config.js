module.exports = {
  globPatterns: [
    '**/*.@(html|js|css)',
    '**/*.@(otf|woff|woff2)',
    '**/*.@(jpg|png|svg)',
  ],
  importScripts: [
    'worker.js'
  ],
  swDest: '../public/service-worker.js',
  globDirectory: '../public/',
  navigateFallback: '/index.html',
  maximumFileSizeToCacheInBytes: 10485760, // vendor.js is big
};
