// Trail detail modal
$('.trail-tile').on('click', function() {
    $('.small.modal')
    .modal('setting', 'transition', 'vertical flip')
    .modal('toggle', 'show-dimmer')
})
