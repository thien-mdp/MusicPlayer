function toast({
    title = '',
    message = '',
    type = 'info',
    duration = 3000
}) {
        const main = document.getElementById('toast');
        if(main){
            const toast = document.createElement('div');
            //
            const autoRemove = setTimeout(function () {
                main.removeChild(toast)
            }, duration + 1000)

            toast.onclick = function(e){
                if(e.target.closest('.toast__close')){
                    main.removeChild(toast);
                    clearTimeout(autoRemove);
                }
            }

            const icons = {
                success: 'fa-solid fa-circle-check',
                info: 'fa-solid fa-circle-info',
                warning: 'fa-solid fa-circle-exclamation',
                error: 'fa-solid fa-triangle-exclamation',

            }
            const icon = icons[type];

            const delay = (duration/1000).toFixed(2)

            toast.classList.add('toast', `toast--${type}`);
            toast.style.animation = `slideInleft ease .3s, fadeOut linear 1s ${delay}s forwards`;

            toast.innerHTML = `
                <div class="toast__icon">
                    <i class="${icon}"></i>
                </div>
                <div class="toast__body">
                    <h3 class="toast__title">${title}</h3>
                    <p class="toast__message">${message}</p>
                </div>
                <div class="toast__close">
                    <i class="fa-solid fa-xmark"></i>
                </div>
            `;
            main.appendChild(toast)

            
        }
}
