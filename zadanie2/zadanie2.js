const btn = document.querySelector('.j-btn');
btn.addEventListener('click', () =>{
    const size = `Текущее разрешение экрана: \n Ширина - ${window.screen.width}px \n Высота - ${window.screen.height}px`;
    alert(size);
})