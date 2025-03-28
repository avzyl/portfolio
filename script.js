const thumbnails = document.querySelectorAll('.thumbnail');
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.getElementById('closeModal');
let zoomLevel = 1;

thumbnails.forEach(thumbnail => {
  thumbnail.addEventListener('click', () => {
    modalImage.src = thumbnail.src;
    modal.style.display = 'flex';
    zoomLevel = 1;
    modalImage.style.transform = `scale(${zoomLevel})`;
  });
});

// Close modal
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});


modalImage.addEventListener('wheel', (event) => {
  event.preventDefault();
  zoomLevel += event.deltaY * -0.01;
  zoomLevel = Math.min(Math.max(zoomLevel, 1), 3);
  modalImage.style.transform = `scale(${zoomLevel})`;
});
