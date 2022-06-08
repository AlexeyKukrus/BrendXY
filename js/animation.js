let swiper = document.querySelector('.swiper'),
  swiperList = swiper.querySelector('.swiper-list'),
  swiperTrack = swiper.querySelector('.swiper-track'),
  swipes = swiper.querySelectorAll('.swipe'),
  arrows = swiper.querySelector('.swiper-arrows'),
  prev = arrows.children[0],
  next = arrows.children[1],
  swipeWidth = swipes[0].offsetWidth,
  swipeIndex = 0,
  posInit = 0,
  posX1 = 0,
  posX2 = 0,
  posY1 = 0,
  posY2 = 0,
  posFinal = 0,
  isSwipe = false,
  isScroll = false,
  allowSwipe = true,
  transition = true,
  nextTrf = 0,
  prevTrf = 0,
  lastTrf = --swipes.length * swipeWidth,
  posThreshold = swipes[0].offsetWidth * 0.35,
  trfRegExp = /([-0-9.]+(?=px))/,
  getEvent = function() {
    return (event.type.search('touch') !== -1) ? event.touches[0] : event;
  },
  swipe = function() {
    if (transition) {
      swiperTrack.style.transition = 'transform .5s';
    }
    swiperTrack.style.transform = `translate3d(-${swipeIndex * swipeWidth}px, 0px, 0px)`;

    prev.classList.toggle('disabled', swipeIndex === 0);
    next.classList.toggle('disabled', swipeIndex === --swipes.length);
  },
  swipeStart = function() {
    let evt = getEvent();

    if (allowSwipe) {

      transition = true;

      nextTrf = (swipeIndex + 1) * -swipeWidth;
      prevTrf = (swipeIndex - 1) * -swipeWidth;

      posInit = posX1 = evt.clientX;
      posY1 = evt.clientY;

      swiperTrack.style.transition = '';

      document.addEventListener('touchmove', swipeAction);
      document.addEventListener('mousemove', swipeAction);
      document.addEventListener('touchend', swipeEnd);
      document.addEventListener('mouseup', swipeEnd);

      swiperList.classList.remove('grab');
      swiperList.classList.add('grabbing');
    }
  },
  swipeAction = function() {

    let evt = getEvent(),
      style = swiperTrack.style.transform,
      transform = +style.match(trfRegExp)[0];

    posX2 = posX1 - evt.clientX;
    posX1 = evt.clientX;

    posY2 = posY1 - evt.clientY;
    posY1 = evt.clientY;

    // определение действия свайп или скролл
    if (!isSwipe && !isScroll) {
      let posY = Math.abs(posY2);
      if (posY > 7 || posX2 === 0) {
        isScroll = true;
        allowSwipe = false;
      } else if (posY < 7) {
        isSwipe = true;
      }
    }

    if (isSwipe) {
      // запрет ухода влево на первом слайде
      if (swipeIndex === 0) {
        if (posInit < posX1) {
          setTransform(transform, 0);
          return;
        } else {
          allowSwipe = true;
        }
      }

      // запрет ухода вправо на последнем слайде
      if (swipeIndex === --swipes.length) {
        if (posInit > posX1) {
          setTransform(transform, lastTrf);
          return;
        } else {
          allowSwipe = true;
        }
      }

      // запрет протаскивания дальше одного слайда
      if (posInit > posX1 && transform < nextTrf || posInit < posX1 && transform > prevTrf) {
        reachEdge();
        return;
      }

      // двигаем слайд
      swiperTrack.style.transform = `translate3d(${transform - posX2}px, 0px, 0px)`;
    }

  },
  swipeEnd = function() {
    posFinal = posInit - posX1;

    isScroll = false;
    isSwipe = false;

    document.removeEventListener('touchmove', swipeAction);
    document.removeEventListener('mousemove', swipeAction);
    document.removeEventListener('touchend', swipeEnd);
    document.removeEventListener('mouseup', swipeEnd);

    swiperList.classList.add('grab');
    swiperList.classList.remove('grabbing');

    if (allowSwipe) {
      if (Math.abs(posFinal) > posThreshold) {
        if (posInit < posX1) {
          swipeIndex--;
        } else if (posInit > posX1) {
          swipeIndex++;
        }
      }

      if (posInit !== posX1) {
        allowSwipe = false;
        swipe();
      } else {
        allowSwipe = true;
      }

    } else {
      allowSwipe = true;
    }

  },
  setTransform = function(transform, comapreTransform) {
    if (transform >= comapreTransform) {
      if (transform > comapreTransform) {
        swiperTrack.style.transform = `translate3d(${comapreTransform}px, 0px, 0px)`;
      }
    }
    allowSwipe = false;
  },
  reachEdge = function() {
    transition = false;
    swipeEnd();
    allowSwipe = true;
  };

swiperTrack.style.transform = 'translate3d(0px, 0px, 0px)';
swiperList.classList.add('grab');

swiperTrack.addEventListener('transitionend', () => allowSwipe = true);
swiper.addEventListener('touchstart', swipeStart);
swiper.addEventListener('mousedown', swipeStart);

arrows.addEventListener('click', function() {
  let target = event.target;

  if (target.classList.contains('next-btn')) {
    swipeIndex++;
  } else if (target.classList.contains('prev-btn')) {
    swipeIndex--;
  } else {
    return;
  }

  swipe();
});