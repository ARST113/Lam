Lampa.Platform.tv();

(function () {
    'use strict';

    console.log('[SorterPlugin] Кастомный порядок кнопок');

    function startPlugin() {
        try {
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

                            // Собираем все кнопки (кроме .button--play, чтобы не ломать Cinema)
                            var all = fullContainer.find('.buttons--container .full-start__button')
                                .add(targetContainer.find('.full-start__button'));

                            // Фильтруем по классам
                            var cinema       = all.filter('.cinema');
                            var online       = all.filter('.online');
                            var torrent      = all.filter('.torrent');
                            var trailer      = all.filter('.trailer');
                            var favorite     = all.filter('.button--favorite');
                            var like         = all.filter('.button--like, .button--vote, .button--reaction');
                            var submenu      = all.filter('.button--submenu, .button--menu');

                            // Исключаем всё вышеперечисленное, чтобы найти "остальные"
                            var rest = all.not('.cinema, .online, .torrent, .trailer, .button--favorite, .button--like, .button--vote, .button--reaction, .button--submenu, .button--menu, .button--play');

                            // Собираем в порядке
                            var newOrder = [];
                            // 1) Cinema (не перемещаем, если хотим, чтобы она осталась «на месте» — можно убрать из сортировки)
                            cinema.each(function(){ newOrder.push($(this)); });
                            // 2) Online
                            online.each(function(){ newOrder.push($(this)); });
                            // 3) Torrent
                            torrent.each(function(){ newOrder.push($(this)); });
                            // 4) Trailer
                            trailer.each(function(){ newOrder.push($(this)); });
                            // 5) Favorite
                            favorite.each(function(){ newOrder.push($(this)); });
                            // 6) Like / Vote
                            like.each(function(){ newOrder.push($(this)); });
                            // 7) Submenu (три точки)
                            submenu.each(function(){ newOrder.push($(this)); });
                            // 8) Остальные
                            rest.each(function(){ newOrder.push($(this)); });

                            // Теперь "удаляем" (detach) все, кроме button--play (чтобы сохранить кликабельность Cinema)
                            targetContainer.find('.full-start__button').not('.button--play').detach();

                            // Вставляем по порядку
                            newOrder.forEach(function ($b) {
                                targetContainer.append($b);
                            });

                            // Возвращаем управление
                            Lampa.Controller.toggle("full_start");
                            console.log('[SorterPlugin] Порядок кнопок изменён (кастом)');
                        } catch (err) {
                            console.error('[SorterPlugin] Ошибка в кастомном порядке:', err);
                        }
                    }, 100);
                }
            });

            if (typeof module !== 'undefined' && module.exports) {
                module.exports = {};
            }
        } catch (err) {
            console.error('[SorterPlugin] Ошибка инициализации плагина (кастом):', err);
        }
    }

    startPlugin();
})();
