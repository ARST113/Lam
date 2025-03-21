
(function(){
    'use strict';

    // Функция инициализации плагина
    function startPlugin(){
        // Подписываемся на событие, возникающее при открытии карточки "full"
        Lampa.Listener.follow('full', function(e){
            if(e.type === 'complite'){
                // Добавляем CSS-правила только один раз
                if(!document.getElementById('plugin-old-interface-hover-style')){
                    let style = document.createElement('style');
                    style.id = 'plugin-old-interface-hover-style';
                    style.innerHTML = `
                        /* Скрываем текст в кнопках по умолчанию */
                        .full-start__button span {
                            display: none;
                        }
                        /* При наведении курсора текст отображается */
                        .full-start__button:hover span {
                            display: inline-block;
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
        });
    }

    // Проверяем, чтобы плагин не запускался повторно
    if(!window.plugin_old_interface_hover){
        window.plugin_old_interface_hover = true;
        startPlugin();
    }
})();
