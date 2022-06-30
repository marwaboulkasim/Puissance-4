$('#game').ready(function(){
    const p4 = new P4('#game', 7, 6, 'yellow', 'red','Marwa', 'alexandre');

    $('#restart').on('click', function(){
        $('#game').empty();
        p4.drawGame();
        $('#restart').css('visibility', 'hidden');
    })
});