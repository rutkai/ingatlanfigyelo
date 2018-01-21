//init Sidenav
var Sidenav = function () {
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileMenuButton = document.getElementById('jsMobileMenuButton');
  var mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  var mobileMenuItems = document.querySelectorAll('.js-mobile-menu-item');
  var body = document.getElementById('body');
  
  for (var i = 0; i < mobileMenuItems.length; i++) {
    mobileMenuItems[i].addEventListener('click', function () {
      close();
    })
  }
  
  mobileMenuButton.addEventListener('click', function () {
    mobileMenu.classList.add('is-open');
    mobileMenuOverlay.classList.add('is-visible');
    body.classList.add('overflow-y-hidden');
  });
  
  mobileMenuOverlay.addEventListener('click', function () {
    mobileMenu.classList.remove('is-open');
    mobileMenuOverlay.classList.remove('is-visible');
    body.classList.remove('overflow-y-hidden');
  });
  
  function close() {
    mobileMenu.classList.remove('is-open');
    mobileMenuOverlay.classList.remove('is-visible');
    body.classList.remove('overflow-y-hidden');
  }
  
  return {
    closeSidenav: close
  }
}