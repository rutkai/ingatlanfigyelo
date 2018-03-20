module.exports = {
  staticFileGlobs: [
    '../public/**/*.@(html|js|css)',
    '../public/**/*.@(otf|woff|woff2)',
    '../public/**/*.@(jpg|png|svg)',
  ],
  importScripts: [
    'worker.js'
  ],
  root: '../public',
  stripPrefix: '../public/',
  navigateFallback: '/index.html',
  maximumFileSizeToCacheInBytes: 10485760, // vendor.js is big
};
