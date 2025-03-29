Lampa.Platform.tv();

(function () {
    'use strict';
    
    console.log('[SorterPlugin] плагин с интеграцией Cinema и сортировкой загружен');

    function startPlugin() {
        try {
            // Если параметр уже задан, сбрасываем его
            if (Lampa.Storage.get('full_btn_priority') !== undefined) {
                Lampa.Storage.set('full_btn_priority', '{}');
            }

            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'complite') {
                    setTimeout(function () {
                        try {
                            var fullContainer = e.object.activity.render();
                            var targetContainer = fullContainer.find('.full-start-new__buttons');
                            console.log('[SorterPlugin] Обнаружен контейнер:', targetContainer);

                            // Собираем все кнопки из двух контейнеров
                            var allButtons = fullContainer.find('.buttons--container .full-start__button')
                                .add(targetContainer.find('.full-start__button'));

                            // Разбиваем кнопки на группы по классам
                            // Cinema оставляем без изменений, чтобы её функциональность не нарушалась.
                            var cinemaButtons  = allButtons.filter('.cinema');
                            var torrentButtons = allButtons.filter('.torrent');
                            var onlineButtons  = allButtons.filter('.online');
                            var trailerButtons = allButtons.filter('.trailer');
                            var otherButtons   = allButtons.not('.cinema, .torrent, .online, .trailer');

                            // Отсоединяем (detach) группы, чтобы сохранить привязанные обработчики
                            torrentButtons.detach();
                            onlineButtons.detach();
                            trailerButtons.detach();
                            otherButtons.detach();
                            // cinemaButtons оставляем на месте

                            // Формируем новый порядок:
                            // 1. Cinema (не перемещаем, оставляем их как есть)
                            // 2. Torrent
                            // 3. Online
                            // 4. Trailer
                            // 5. Остальные
                            var newOrder = []
                                .concat(torrentButtons.get())
                                .concat(onlineButtons.get())
                                .concat(trailerButtons.get())
                                .concat(otherButtons.get());

                            // Очищаем контейнер для сортируемых кнопок, исключая уже работающие Cinema
                            // (Если Cinema нужно оставить в начале, они не удаляются)
                            targetContainer.find('.full-start__button').not('.cinema').remove();

                            // Добавляем отсортированные кнопки в новый порядок
                            newOrder.forEach(function (btn) {
                                targetContainer.append(btn);
                            });

                            // Возвращаем управление (если необходимо)
                            Lampa.Controller.toggle("full_start");
                            console.log('[SorterPlugin] Новый порядок кнопок применён');
                        } catch (err) {
                            console.error('[SorterPlugin] Ошибка сортировки кнопок:', err);
                        }
                    }, 100);
                }
            });

            if (typeof module !== 'undefined' && module.exports) {
                module.exports = {};
            }
        } catch (err) {
            console.error('[SorterPlugin] Ошибка инициализации плагина:', err);
        }
    }

    startPlugin();
})();
