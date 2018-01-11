( () => {
  'use strict';

document.onreadystatechange = function () {
  if (document.readyState === 'interactive') {
    
    // Nav Animation
    
    
    //init Waves effect
    // Waves.init();
    // Waves.attach('.waves');
    
    
    // Initialize Dropdowns
    const dropdown = document.querySelectorAll('.js-dropdown');
    for (let i = 0; i < dropdown.length; i++) {
      const initDropdowns = new Dropdown(dropdown[i]);
    }
    
    // Initialize SideNav
    const sidenav = document.querySelectorAll('.js-mobile-menu');
    for (let i = 0; i < sidenav.length; i++) {
      const initSidenav = new Sidenav(sidenav[i]);
    }
    
    // Cookie Conset
    // window.cookieconsent.initialise({
    //     "pavarte": {
    //       "popup": {
    //         "background": "#071022"
    //       },
    //       "button": {
    //         "background": "#F35E2E",
    //         "text": "#f7f7f7"
    //       }
    //     },
    //     "theme": "edgeless",
    //     "content": {
    //       "message": "Weboldalunk cookiekat használ",
    //       "dismiss": "Megértettem",
    //       "link": " "
    //     }
    // });
  }
};
  
  
})();
