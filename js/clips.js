(function() {
  function moveClips() {
    var clips = document.getElementById('clips-5s');
    if (!clips) return;
    
    // Tìm section menu hoặc vị trí phù hợp ngay dưới gallery
    var menuSection = document.querySelector('#menu-container') || 
                      document.querySelector('section:has(.grid)') || 
                      document.querySelector('main > section:nth-of-type(3)') ||
                      document.querySelector('#root > div > div:nth-child(3)');
                      
    if (menuSection && menuSection.parentNode) {
      menuSection.parentNode.insertBefore(clips, menuSection);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', moveClips);
  } else {
    moveClips();
  }
  
  // Kiểm tra lặp lại nếu React render sau
  var timer = setInterval(function() {
    var clips = document.getElementById('clips-5s');
    if (clips && clips.previousElementSibling && clips.previousElementSibling.tagName === 'SECTION') {
      clearInterval(timer);
      return;
    }
    moveClips();
  }, 500);

  setTimeout(function() { clearInterval(timer); }, 10000);
})();