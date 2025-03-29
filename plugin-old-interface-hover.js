Lampa.Platform.tv();

(function () {
    'use strict';

    console.log('[SorterPlugin] плагин загружен');

    function startPlugin() {
        try {
            // Сброс приоритета, если задан
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

                            // Определяем группы по классам
                            var cinemaButtons  = allButtons.filter('.cinema');
                            var torrentButtons = allButtons.filter('.torrent');
                            var onlineButtons  = allButtons.filter('.online');
                            var trailerButtons = allButtons.filter('.trailer');
                            var otherButtons   = allButtons.not('.cinema, .torrent, .online, .trailer');

                            console.log('[SorterPlugin] Количество: Cinema:', cinemaButtons.length, 
                                'Torrent:', torrentButtons.length, 
                                'Online:', onlineButtons.length, 
                                'Trailer:', trailerButtons.length, 
                                'Остальные:', otherButtons.length);

                            // Отсоединяем кнопки, чтобы сохранить события
                            cinemaButtons.detach();
                            torrentButtons.detach();
                            onlineButtons.detach();
                            trailerButtons.detach();
                            otherButtons.detach();

                            // Формируем новый порядок
                            var newOrder = cinemaButtons.get()
                                .concat(torrentButtons.get(), onlineButtons.get(), trailerButtons.get(), otherButtons.get());

                            // Очищаем контейнер (это безопасно, т.к. кнопки уже отсоединены)
                            targetContainer.empty();

                            // Вставляем кнопки в новом порядке
                            newOrder.forEach(function(btn) {
                                targetContainer.append(btn);
                            });

                            Lampa.Controller.toggle("full_start");
                            console.log('[SorterPlugin] Новый порядок применён');
                        } catch (err) {
                            console.error('[SorterPlugin] Ошибка сортировки кноп
