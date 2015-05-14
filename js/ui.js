function store(time){

    if (localStorage.getItem('time') === null)
        localStorage.setItem('time', time);
    else{
        if (time > localStorage.getItem('time')){
            localStorage.setItem('time', time);
        }
    }

    
    displayTime(localStorage.getItem('time'), '#best_n');
}

function timeToText(time){
    var milli = Math.floor((time%60)*1.3);
    var sec = Math.floor(time/60);
    var min = Math.floor(sec/60);
    return min+":"+sec+":"+milli;
}

function displayTime(time, div) {
    $(div).text(timeToText(time));
}


function play() {
    
    $('#play').css('display', 'none');
    playing = true;
    setupScene();
    
}

function gameOver() {
    $('#play').css('display', 'inline');
    $('#play').fadeIn();
}

function loopColor(){
    
    var ex1 = document.querySelector('#score');
    var ex2 = document.querySelector('#info');
    var ex3 = document.querySelector('#howto');
    var ex4 = document.querySelector('#play');
    
    sweep(ex1, 'background-color', 'hsl(0, 1, 0.5)', 'hsl(359, 1, 0.5)', {
          callback: loopColor,
          direction: 1,
          duration: 30000,
          space: 'HUSL'
        });
    
    sweep(ex2, 'background-color', 'hsl(0, 1, 0.5)', 'hsl(359, 1, 0.5)', {
      callback: loopColor,
      direction: 1,
      duration: 30000,
      space: 'HUSL'
    });

    sweep(ex3, 'background-color', 'hsl(0, 1, 0.5)', 'hsl(359, 1, 0.5)', {
      callback: loopColor,
      direction: 1,
      duration: 30000,
      space: 'HUSL'
    });

    sweep(ex4, 'background-color', 'hsl(0, 1, 0.5)', 'hsl(359, 1, 0.5)', {
      callback: loopColor,
      direction: 1,
      duration: 30000,
      space: 'HUSL'
    });
    
}

function getUiColor(){
        
    var color = $('#info').css('background-color');
    
    return color;
    
}

loopColor();