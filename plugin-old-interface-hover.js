Lampa.Platform.tv();

(function () {
    'use strict';

    console.log('[SorterPlugin] загружен');

    function startPlugin() {
        try {
            if (Lampa.Storage.get('full_btn_priority') !== undefined) {
                Lampa.Storage.set('full_btn_priority', '{}');
            }

            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'complite') {
                    setTimeout(function () {
                        try {
                            const fullContainer = e.object.activity.render();
                            const targetContainer = fullContainer.find('.full-start-new__buttons');
                            const allButtons = fullContainer.find('.buttons--container .full-start__button')
                                .add(targetContainer.find('.full-start__button'));

                            const cinema = allButtons.filter('.cinema');
                            const torrent = allButtons.filter('.torrent');
                            const online = allButtons.filter(function () {
                                return $(this).attr('class').includes('online');
                            });
                            const trailers = allButtons.filter(function () {
                                return $(this).attr('class').includes('trailer');
                            });
                            const other = allButtons.not('.cinema, .torrent')
                                .filter(function () {
                                    const cls = $(this).attr('class');
                                    return !cls.includes('online') && !cls.includes('trailer');
                                });

                            const orderedButtons = []
                                .concat(cinema.get())
                                .concat(torrent.get())
                                .concat(online.get())
                                .concat(trailers.get())
                                .concat(other.get());

                            // Удаляем старые, кроме button--play (если нужен)
                            targetContainer.find('.full-start__button').not('.button--play').remove();

                            // Добавляем в порядке
                            orderedButtons.forEach(btn => {
                                targetContainer.append(btn);
                            });

                            Lampa.Controller.toggle("full_start");
                            console.log('[SorterPlugin] порядок обновлён');
                        } catch (err) {
                            console.error('[SorterPlugin] ошибка сортировки:', err);
                        }
                    }, 100);
                }
            });

            if (typeof module !== 'undefined' && module.exports) {
                module.exports = {};
            }
        } catch (err) {
            console.error('[SorterPlugin] ошибка запуска:', err);
        }
    }

    startPlugin();
})();
