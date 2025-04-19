const thumbnails = document.querySelectorAll('.thumbnail');
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalVideo = document.getElementById('modalVideo');
const closeModal = document.getElementById('closeModal');
let zoomLevel = 1;
let isDragging = false;
let startX, startY, currentX = 0, currentY = 0;

thumbnails.forEach(thumbnail => {
  thumbnail.addEventListener('click', () => {
    const videoSrc = thumbnail.dataset.video;
    if (videoSrc) {
      modalImage.style.display = 'none';
      modalVideo.style.display = 'block';
      modalVideo.src = videoSrc;
    } else {
      modalVideo.style.display = 'none';
      modalVideo.src = '';
      modalImage.src = thumbnail.src;
      modalImage.style.display = 'block';
    }
    modal.style.display = 'flex';
    zoomLevel = 1;
    modalImage.style.transform = `scale(${zoomLevel}) translate(0px, 0px)`;
  });
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
  modalVideo.src = '';
});

modalImage.addEventListener('wheel', (event) => {
  event.preventDefault();
  zoomLevel += event.deltaY * -0.01;
  zoomLevel = Math.min(Math.max(zoomLevel, 1), 3);
  modalImage.style.transform = `scale(${zoomLevel}) translate(${currentX}px, ${currentY}px)`;
});

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
