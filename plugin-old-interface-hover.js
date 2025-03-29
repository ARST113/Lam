Lampa.Platform.tv();

(function () {
    'use strict';

    console.log('[SorterPlugin] Запуск плагина с кастомным порядком');

    function startPlugin() {
        try {
            // Сброс приоритета, если он установлен
            if (Lampa.Storage.get('full_btn_priority') !== undefined) {
                Lampa.Storage.set('full_btn_priority', '{}');
            }

            Lampa.Listener.follow('full', function(e) {
                if (e.type === 'complite') {
                    setTimeout(function() {
                        try {
                            var fullContainer = e.object.activity.render();
                            var targetContainer = fullContainer.find('.full-start-new__buttons');
                            console.log('[SorterPlugin] Найден контейнер:', targetContainer);

                            // Собираем все кнопки (из двух контейнеров)
                            var allButtons = fullContainer.find('.buttons--container .full-start__button')
                                .add(targetContainer.find('.full-start__button'));

                            // Фильтруем группы кнопок:
                            var online  = allButtons.filter(function() {
                                return $(this).attr('class').includes('online');
                            });
                            var torrent = allButtons.filter('.torrent');
                            var cinema  = allButtons.filter('.cinema');
                            var trailer = allButtons.filter(function() {
                                return $(this).attr('class').includes('trailer');
                            });

                            // Остальные кнопки (не online, не torrent, не cinema, не trailer)
                            var rest = allButtons.not('.cinema, .torrent')
                                                 .filter(function() {
                                var cls = $(this).attr('class');
                                return !cls.includes('online') && !cls.includes('trailer');
                            });

                            // Отсоединяем (detach), чтобы сохранить обработчики
                            online.detach();
                            torrent.detach();
                            cinema.detach();
                            trailer.detach();
                            rest.detach();

                            // Формируем порядок:
                            // 1) online
                            // 2) torrent
                            // 3) cinema
                            // 4) trailer
                            // 5) все остальные
                            var newOrder = []
                                .concat(online.get())
                                .concat(torrent.get())
                                .concat(cinema.get())
                                .concat(trailer.get())
                                .concat(rest.get());

                            // Удаляем всё, кроме .button--play (если есть) — 
                            // иногда Cinema её использует. Если нужно, можно убрать .button--play из исключений
                            targetContainer.find('.full-start__button').not('.button--play').remove();

                            // Вставляем в новом порядке
                            newOrder.forEach(function (btn) {
                                targetContainer.append(btn);
                            });

                            // Возвращаем управление
                            Lampa.Controller.toggle("full_start");
                            console.log('[SorterPlugin] Новый порядок кнопок применён');
                        } catch (err) {
                            console.error('[SorterPlugin] Ошибка сортировки:', err);
                        }
                    }, 100);
                }
            });

            // Экспорт для CommonJS, если нужно
            if (typeof module !== 'undefined' && module.exports) {
                module.exports = {};
            }
        } catch (err) {
            console.error('[SorterPlugin] Ошибка инициализации плагина:', err);
        }
    }

    startPlugin();
})();
