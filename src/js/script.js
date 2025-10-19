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