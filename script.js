const thumbnails = document.querySelectorAll('.thumbnail');
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalVideo = document.getElementById('modalVideo');
const closeModal = document.getElementById('closeModal');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');

let slides = [];
let currentSlideIndex = 0;

let zoomLevel = 1;
let isDragging = false;
let startX, startY, currentX = 0, currentY = 0;

// Handle thumbnail clicks
thumbnails.forEach(thumbnail => {
  thumbnail.addEventListener('click', () => {
    const videoSrc = thumbnail.dataset.video;
    if (videoSrc) {
      modalImage.style.display = 'none';
      modalVideo.style.display = 'block';
      modalVideo.src = videoSrc;
      slides = [];
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
    } else {
      const slidesData = thumbnail.dataset.slides 
        ? JSON.parse(thumbnail.dataset.slides) 
        : [thumbnail.src];
      slides = slidesData;
      currentSlideIndex = 0;
      showSlide(currentSlideIndex);
    }

    modal.style.display = 'flex';
    resetZoomAndPosition();
  });
});

// Show slide by index
function showSlide(index) {
  modalVideo.style.display = 'none';
  modalVideo.src = '';
  modalImage.src = slides[index];
  modalImage.style.display = 'block';
  resetZoomAndPosition();

  if (slides.length <= 1) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
  } else {
    prevBtn.style.display = "block";
    nextBtn.style.display = "block";
  }
}

// Reset zoom + drag
function resetZoomAndPosition() {
  zoomLevel = 1;
  currentX = 0;
  currentY = 0;
  modalImage.style.transform = `scale(${zoomLevel}) translate(${currentX}px, ${currentY}px)`;
  modalImage.style.cursor = 'grab';
}

// Navigation buttons
function showPrev() {
  if (slides.length > 0) {
    currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    showSlide(currentSlideIndex);
  }
}

function showNext() {
  if (slides.length > 0) {
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    showSlide(currentSlideIndex);
  }
}

prevBtn.addEventListener('click', showPrev);
nextBtn.addEventListener('click', showNext);

// Touch support for nav buttons
prevBtn.addEventListener('touchstart', (e) => { e.preventDefault(); showPrev(); });
nextBtn.addEventListener('touchstart', (e) => { e.preventDefault(); showNext(); });

// Close modal
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
  modalVideo.src = '';
  slides = [];
  resetZoomAndPosition();
});

// Zoom with scroll wheel
modalImage.addEventListener('wheel', (event) => {
  event.preventDefault();
  zoomLevel += event.deltaY * -0.01;
  zoomLevel = Math.min(Math.max(zoomLevel, 1), 3);
  modalImage.style.transform = `scale(${zoomLevel}) translate(${currentX}px, ${currentY}px)`;
});

// Mouse dragging
modalImage.addEventListener('mousedown', (event) => {
  isDragging = true;
  startX = event.clientX - currentX;
  startY = event.clientY - currentY;
  modalImage.style.cursor = 'grabbing';
});

modalImage.addEventListener('mousemove', (event) => {
  if (!isDragging) return;
  currentX = event.clientX - startX;
  currentY = event.clientY - startY;
  modalImage.style.transform = `scale(${zoomLevel}) translate(${currentX}px, ${currentY}px)`;
});

modalImage.addEventListener('mouseup', () => {
  isDragging = false;
  modalImage.style.cursor = 'grab';
});

modalImage.addEventListener('mouseleave', () => {
  isDragging = false;
  modalImage.style.cursor = 'grab';
});

// Touch dragging
modalImage.addEventListener('touchstart', (event) => {
  if (event.touches.length === 1) {
    isDragging = true;
    startX = event.touches[0].clientX - currentX;
    startY = event.touches[0].clientY - currentY;
  }
});

modalImage.addEventListener('touchmove', (event) => {
  if (!isDragging || event.touches.length !== 1) return;
  currentX = event.touches[0].clientX - startX;
  currentY = event.touches[0].clientY - startY;
  modalImage.style.transform = `scale(${zoomLevel}) translate(${currentX}px, ${currentY}px)`;
});

modalImage.addEventListener('touchend', () => {
  isDragging = false;
});

// Keyboard navigation
document.addEventListener('keydown', (event) => {
  if (modal.style.display === 'flex') {
    if (event.key === 'ArrowRight') {
      showNext();
    } else if (event.key === 'ArrowLeft') {
      showPrev();
    } else if (event.key === 'Escape') {
      closeModal.click();
    }
  }
});
