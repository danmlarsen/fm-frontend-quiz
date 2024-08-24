const checkbox = document.getElementById('theme-checkbox');

checkbox?.addEventListener('click', function (e) {
    document.body.classList.toggle('dark-mode');
});
