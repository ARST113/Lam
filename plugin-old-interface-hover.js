Lampa.Platform.tv();

(function () {
    'use strict';

    console.log('[SorterPlugin] плагин загружен');

    function startPlugin() {
        try {
            if (Lampa.Storage.get('full_btn_priority') !== undefined) {
                Lampa.Storage.set('full_btn_priority', '{}');
            }

            Lampa.Listener.follow('full', function(e) {
                if (e.type === 'complite') {
                    setTimeout(function() {
                        try {
                            var fullContainer = e.object.activity.render();
                            var targetContainer = fullContainer.find('.full-start-new__buttons');
                            console.log('[SorterPlugin] Контейнер найден:', targetContainer);

                            // Собираем все кнопки из двух контейнеров
                            var allButtons = fullContainer.find('.buttons--container .full-start__button')
                                .add(targetContainer.find('.full-start__button'));
                            console.log('[SorterPlugin] Общее количество кнопок:', allButtons.length);

                            // Фильтруем группы кнопок по классам (все сравнения делаем в нижнем регистре)
                            var online = allButtons.filter(function() {
                                return $(this).attr('class').toLowerCase().includes('online');
                            });
                            var torrent = allButtons.filter(function() {
                                return $(this).attr('class').toLowerCase().includes('torrent');
                            });
                            var cinema = allButtons.filter(function() {
                                return $(this).attr('class').toLowerCase().includes('cinema');
                            });
                            var trailer = allButtons.filter(function() {
                                return $(this).attr('class').toLowerCase().includes('trailer');
                            });

                            console.log('[SorterPlugin] online:', online.length);
                            console.log('[SorterPlugin] torrent:', torrent.length);
                            console.log('[SorterPlugin] cinema:', cinema.length);
                            console.log('[SorterPlugin] trailer:', trailer.length);

                            // Остальные кнопки – те, которые не попали в предыдущие группы
                            var rest = allButtons.not(online).not(torrent).not(cinema).not(trailer);
                            console.log('[SorterPlugin] Остальные кнопки:', rest.length);

                            // Отсоединяем группы, чтобы сохранить обработчики событий
                            online.detach();
                            torrent.detach();
                            cinema.detach();
                            trailer.detach();
                            rest.detach();

                            // Новый порядок (согласно требованиям):
                            // 1) Online → 2) Torrent → 3) Cinema → 4) Trailer → 5) Остальные
                            var newOrder = []
                                .concat(online.get())
                                .concat(torrent.get())
                                .concat(cinema.get())
                                .concat(trailer.get())
                                .concat(rest.get());

                            // Очищаем контейнер полностью
                            targetContainer.empty();
                            newOrder.forEach(function(btn) {
                                targetContainer.append(btn);
                            });

                            Lampa.Controller.toggle("full_start");
                            console.log('[SorterPlugin] Порядок кнопок обновлён');
                        } catch(err) {
                            console.error('[SorterPlugin] Ошибка сортировки:', err);
                        }
                    }, 500); // увеличенная задержка 500 мс
                }
            });

            if (typeof module !== 'undefined' && module.exports) {
                module.exports = {};
            }
        } catch(err) {
            console.error('[SorterPlugin] Ошибка инициализации плагина:', err);
        }
    }

    startPlugin();
})();
