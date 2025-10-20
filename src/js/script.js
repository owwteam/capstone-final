function initMarqueeSlider() {
  const track = document.querySelector('.slider-track');
  const prevBtn = document.querySelector('.proof-prev');
  const nextBtn = document.querySelector('.proof-next');

  let slides = Array.from(document.querySelectorAll('.slider-proof-parent'));
  const slideCount = slides.length;
  const slideWidth = slides[0].offsetWidth;

  // Clone first & last slides
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slideCount - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.insertBefore(lastClone, slides[0]);

  // Update slides list
  slides = Array.from(document.querySelectorAll('.slider-proof-parent'));
  let current = 1;

  // Set initial position
  track.style.transform = `translateX(-${slideWidth * current}px)`;
  setActiveSlide(current);

  function updateSlide() {
    track.style.transition = 'transform 0.5s ease';
    track.style.transform = `translateX(-${slideWidth * current}px)`;
    setActiveSlide(current);
  }

  function setActiveSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }

  nextBtn.addEventListener('click', () => {
    if (current >= slides.length - 1) return;
    current++;
    updateSlide();
  });

  prevBtn.addEventListener('click', () => {
    if (current <= 0) return;
    current--;
    updateSlide();
  });

  track.addEventListener('transitionend', () => {
    if (slides[current].isEqualNode(firstClone)) {
      track.style.transition = 'none';
      current = 1;
      track.style.transform = `translateX(-${slideWidth * current}px)`;
    }

    if (slides[current].isEqualNode(lastClone)) {
      track.style.transition = 'none';
      current = slideCount;
      track.style.transform = `translateX(-${slideWidth * current}px)`;
    }

    setActiveSlide(current);
  });

  // Handle resizing
  window.addEventListener('resize', () => {
    const newSlideWidth = slides[0].offsetWidth;
    track.style.transition = 'none';
    track.style.transform = `translateX(-${newSlideWidth * current}px)`;
  });
}


function initHideOnScroll(){
  const navbar = document.querySelector('.navbar'); // cari di dalam partial
  if (!navbar) return;

  let last = 0;
  const THRESH = 100;

  const onScroll = () => {
    const cur = window.pageYOffset || document.documentElement.scrollTop || 0;
    if (Math.abs(cur - last) <= THRESH) return;
    if (cur > last) navbar.classList.add('hidden');
    else            navbar.classList.remove('hidden');
    last = cur <= 0 ? 0 : cur;
  };

  window.addEventListener('scroll', onScroll, { passive:true });
}


document.addEventListener('DOMContentLoaded', () => {
  try{
    initMarqueeSlider();
  }catch(e){}
  initHideOnScroll();

  document.querySelector('.auto__tab:nth-child(1) .auto__content').style.height = `${document.querySelector('.auto__tab:nth-child(1) .auto__content').scrollHeight}px`;

  try {
    const tabs = Array.from(document.querySelectorAll('.auto__tab'));
    let activeIndex = tabs.findIndex(tab => tab.classList.contains('active'));
    if (activeIndex === -1) activeIndex = 0;

    let progressInterval;
    const PROGRESS_DURATION = 5000;

    const setProgress = (tab, duration) => {
      const value = tab.querySelector('.auto__value');
      if (!value) return;
      value.style.transition = 'none';
      value.style.width = '0%';
      // Force reflow for transition restart
      void value.offsetWidth;
      value.style.transition = `width ${duration}ms linear`;
      value.style.width = '100%';
    };

    const rotateImages = (index) => {
      const images = document.querySelectorAll('.auto__images img');
      images.forEach((img, i) => {
        img.style.display = i === index ? 'block' : 'none';
      });
    };

    const activateTab = (index) => {
      tabs.forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
        tab.querySelector('.auto__content').style.height = i === index
          ? `${tab.querySelector('.auto__content').scrollHeight}px`
          : '0px';
        const value = tab.querySelector('.auto__value');
        if (value) {
          value.style.transition = 'none';
          value.style.width = '0%';
        }
      });
      setProgress(tabs[index], PROGRESS_DURATION);
      rotateImages(index);
    };

    tabs.forEach((block, i) => {
      block.addEventListener('click', (e) => {
        activeIndex = i;
        activateTab(activeIndex);
        clearInterval(progressInterval);
        startProgressInterval();
      });
    });

    const startProgressInterval = () => {
      progressInterval = setInterval(() => {
        activeIndex = (activeIndex + 1) % tabs.length;
        activateTab(activeIndex);
      }, PROGRESS_DURATION);
    };

    // Initial activation
    activateTab(activeIndex);
    startProgressInterval();
  } catch (e) {}
});



//Dropdown Navbar 
(function () {
  const WRAP = '.nav__dropdown';
  const BTN  = '.dropdown__title';
  const MENU = '.dropdown';
  const BLUR = document.querySelector('.all__blur');
  const HOVER_DELAY = 120; // ms

  function showBlur(){ BLUR?.classList.add('active'); }
  function hideBlur(){ BLUR?.classList.remove('active'); }

  function open(dd){
    const btn  = dd.querySelector(BTN);
    const menu = dd.querySelector(MENU);
    dd.classList.add('is-open');
    btn?.setAttribute('aria-expanded','true');
    menu?.setAttribute('aria-hidden','false'); // biar a11y tetap oke
    showBlur();
  }

  function close(dd){
    const btn  = dd.querySelector(BTN);
    const menu = dd.querySelector(MENU);
    dd.classList.remove('is-open');
    btn?.setAttribute('aria-expanded','false');
    menu?.setAttribute('aria-hidden','true');
    if(!document.querySelector(`${WRAP}.is-open`)) hideBlur();
  }

  // init
  document.querySelectorAll(WRAP).forEach(dd=>{
    const btn  = dd.querySelector(BTN);
    const menu = dd.querySelector(MENU);
    if(!btn || !menu) return;

    // a11y baseline
    btn.setAttribute('role','button');
    btn.setAttribute('aria-haspopup','true');
    btn.setAttribute('aria-expanded','false');
    menu.setAttribute('aria-hidden','true');

    let timer;

    // hover desktop
    dd.addEventListener('mouseenter', ()=>{
      clearTimeout(timer);
      open(dd);
    });
    dd.addEventListener('mouseleave', ()=>{
      timer = setTimeout(()=>close(dd), HOVER_DELAY);
    });

    // focus keyboard
    dd.addEventListener('focusin', ()=>{
      clearTimeout(timer);
      open(dd);
    });
    dd.addEventListener('focusout', (e)=>{
      if(!dd.contains(e.relatedTarget)){
        timer = setTimeout(()=>close(dd), HOVER_DELAY);
      }
    });

    // keyboard toggle
    btn.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        dd.classList.contains('is-open') ? close(dd) : open(dd);
      }
      if(e.key === 'Escape'){
        close(dd);
        btn.focus();
      }
    });

    // touch (tap) toggle
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if(isCoarse){
      btn.addEventListener('click', (e)=>{
        e.preventDefault();
        dd.classList.contains('is-open') ? close(dd) : open(dd);
      });
    }
  });

  // klik di luar → tutup semua
  document.addEventListener('click', (e)=>{
    if(!e.target.closest(WRAP)){
      document.querySelectorAll(`${WRAP}.is-open`).forEach(close);
      hideBlur();
    }
  });

  // klik overlay → tutup semua
  BLUR?.addEventListener('click', ()=>{
    document.querySelectorAll(`${WRAP}.is-open`).forEach(close);
    hideBlur();
  });
})();


//SLIDER COMMERCIAL


// (function(){
//   const wrap   = document.querySelector('.content-wrap.hiw-fade');
//   if(!wrap) return;

//   const slides = Array.from(wrap.querySelectorAll('.content-card'));
//   let index = 0, locked = false;

//   // setelah inisialisasi slider
//   wrap.style.setProperty('--progress-dur', '4000ms'); // atau '5s', dsb


//   // set tinggi kontainer sesuai slide aktif
//   function fitHeight(){
//     wrap.style.height = slides[index].offsetHeight + 'px';
//   }

//   function show(i){
//   index = (i + slides.length) % slides.length;

//   slides.forEach((s, idx) => s.classList.toggle('active', idx === index));

//   // === Progress divider: 33% / 66% / 100% (otomatis sesuai jumlah slide) ===
//   const percent = ((index + 1) / slides.length) * 100; // 3 slide => 33.33, 66.66, 100
//   slides.forEach((s) => {
//     const v = s.querySelector('.divider__value');
//     if (v) v.style.height = percent + '%';
//   });

//   fitHeight();
// }


//   // init
//   show(0);
//   window.addEventListener('resize', fitHeight);

//   // navigasi: scroll wheel (dengan throttle)
//   wrap.addEventListener('wheel', (e) => {
//     if (locked) return;
//     locked = true; setTimeout(()=>locked=false, 500);
//     if (e.deltaY > 0) show(index + 1);
//     else show(index - 1);
//     e.preventDefault();
//   }, {passive:false});

//   // navigasi: swipe touch sederhana
//   let startY = 0;
//   wrap.addEventListener('touchstart', e => startY = e.touches[0].clientY, {passive:true});
//   wrap.addEventListener('touchend', e => {
//     const endY = (e.changedTouches[0] || {}).clientY || startY;
//     const dy = endY - startY;
//     if (Math.abs(dy) < 40) return;
//     if (dy < 0) show(index + 1);
//     else show(index - 1);
//   });

//   // opsional: API manual
//   window.hiwFadeNext = () => show(index + 1);
//   window.hiwFadePrev = () => show(index - 1);
// })();


// (function(){
//   const section = document.querySelector('.how-it-work');
//   const pin = section.querySelector('.pin');
//   const wrap = section.querySelector('.content-wrap.hiw-fade');
//   if(!wrap) return;

//   const slides = Array.from(wrap.querySelectorAll('.content-card'));
//   let index = 0, locked = false;

//   // update tinggi
//   function fitHeight(){
//     wrap.style.height = slides[index].offsetHeight + 'px';
//   }

//   function show(i){
//     index = (i + slides.length) % slides.length;
//     slides.forEach((s, idx) => s.classList.toggle('active', idx === index));
//     const percent = ((index + 1) / slides.length) * 100;
//     slides.forEach(s => {
//       const v = s.querySelector('.divider__value');
//       if (v) v.style.height = percent + '%';
//     });
//     fitHeight();
//   }

//   show(0);
//   window.addEventListener('resize', fitHeight);

//   // === Scroll Behavior ===
//   window.addEventListener('scroll', () => {
//     const rect = section.getBoundingClientRect();
//     const isInView = rect.top <= 0 && rect.bottom > window.innerHeight;

//     if (isInView) {
//       pin.style.position = 'fixed';
//       pin.style.top = '0';
//     } else {
//       pin.style.position = '';
//     }

//     // saat mencapai akhir slide, lepaskan sticky
//     const reachedEnd = index === slides.length - 1 && rect.bottom <= window.innerHeight;
//     if (reachedEnd) {
//       pin.style.position = 'relative';
//       pin.style.top = 'auto';
//     }
//   });

//   // navigasi wheel
//   wrap.addEventListener('wheel', (e) => {
//     if (locked) return;
//     locked = true; setTimeout(()=>locked=false, 500);
//     if (e.deltaY > 0) show(index + 1);
//     else show(index - 1);
//     e.preventDefault();
//   }, {passive:false});

//   // navigasi touch
//   let startY = 0;
//   wrap.addEventListener('touchstart', e => startY = e.touches[0].clientY, {passive:true});
//   wrap.addEventListener('touchend', e => {
//     const endY = (e.changedTouches[0] || {}).clientY || startY;
//     const dy = endY - startY;
//     if (Math.abs(dy) < 40) return;
//     if (dy < 0) show(index + 1);
//     else show(index - 1);
//   });

// })();

(function () {
  const section = document.querySelector('.how-it-work');
  if (!section) return;

  const cards = Array.from(section.querySelectorAll('.content-card'));
  const dividers = cards.map(c => c.querySelector('.divider__value'));
  const totalCards = cards.length;

  function updateDivider() {
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;

    // Progress scroll dalam section (0 - 1)
    const scrollY = Math.min(Math.max((vh - rect.top) / (rect.height + vh), 0), 1);
    const part = 1 / totalCards;

    dividers.forEach((divider, i) => {
      const start = part * i;
      const end = part * (i + 1);
      const progress = (scrollY - start) / (end - start);
      const clamped = Math.max(0, Math.min(1, progress));
      divider.style.height = (clamped * 100) + '%';
    });
  }

  window.addEventListener('scroll', updateDivider);
  window.addEventListener('resize', updateDivider);
  updateDivider(); // panggil sekali saat awal
})();
