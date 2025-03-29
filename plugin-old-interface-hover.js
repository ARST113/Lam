Lampa.Platform.tv();

(function () {
    'use strict';

    console.log('[SorterPlugin] Запуск плагина с кастомным порядком');

    function startPlugin() {
        try {
            // Сброс приоритета, если он есть
            if (Lampa.Storage.get('full_btn_priority') !== undefined) {
                Lampa.Storage.set('full_btn_priority', '{}');
            }

            Lampa.Listener.follow('full', function(e) {
                if (e.type === 'complite') {
                    setTimeout(function() {
                        try {
                            var fullContainer = e.object.activity.render();
                            var targetContainer = fullContainer.find('.full-start-new__buttons');
                            console.log('[SorterPlugin] Контейнер:', targetContainer);

                            // Собираем кнопки из двух мест
                            var allButtons = fullContainer.find('.buttons--container .full-start__button')
                                .add(targetContainer.find('.full-start__button'));

                            // Приводим классы к нижнему регистру
                            function hasClass(el, name) {
                                return $(el).attr('class').toLowerCase().includes(name);
                            }

                            // Фильтруем кнопки
                            var online  = allButtons.filter(function() { return hasClass(this, 'online'); });
                            var cinema  = allButtons.filter(function() { return hasClass(this, 'cinema'); });
                            var torrent = allButtons.filter(function() { return hasClass(this, 'torrent'); });
                            var trailer = allButtons.filter(function() { return hasClass(this, 'trailer'); });

                            // Остальные (не online, не cinema, не torrent, не trailer)
                            var rest = allButtons.not(online).not(cinema).not(torrent).not(trailer);

                            // Логируем для отладки
                            console.log('[SorterPlugin] Всего кнопок:', allButtons.length);
                            console.log('[SorterPlugin] Online:', online.length);
                            console.log('[SorterPlugin] Cinema:', cinema.length);
                            console.log('[SorterPlugin] Torrent:', torrent.length);
                            console.log('[SorterPlugin] Trailer:', trailer.length);
                            console.log('[SorterPlugin] Остальные:', rest.length);

                            // Отсоединяем (detach) кнопки, чтобы сохранить события
                            online.detach();
                            cinema.detach();
                            torrent.detach();
                            trailer.detach();
                            rest.detach();

                            // Ставим кнопки в порядок:
                            // 1) Online → 2) Cinema → 3) Torrent → 4) Trailer → 5) Остальное
                            var newOrder = []
                                .concat(online.get())
                                .concat(cinema.get())
                                .concat(torrent.get())
                                .concat(trailer.get())
                                .concat(rest.get());

                            // Очищаем контейнер
                            targetContainer.empty();

                            // Вставляем по очереди
                            newOrder.forEach(function(btn) {
                                targetContainer.append(btn);
                            });

                            // Возвращаем управление
                            Lampa.Controller.toggle("full_start");
                            console.log('[SorterPlugin] Новый порядок кнопок применён');
                        } catch (err) {
                            console.error('[SorterPlugin] Ошибка сортировки:', err);
                        }
                    }, 500); // Увеличили задержку до 500 мс
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
