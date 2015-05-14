var context;
var source, sourceJs;
var analyser;
var url = 'data/Dr_Finkelfrackens_Cure.ogg';
var array = new Array();
var boost = 0;

var interval = window.setInterval(function() {
	if($('#loading_dots').text().length < 3) {
		$('#loading_dots').text($('#loading_dots').text() + '.');
	}
	else {
		$('#loading_dots').text('');
	}
}, 500);

try {
    context = new (window.AudioContext || window.webkitAudioContext)();
}
catch(e) {
	$('#info').text('Web Audio API is not supported in this browser');
}
var request = new XMLHttpRequest();
request.open("GET", url, true);
request.responseType = "arraybuffer";
request.send();
request.onload = function() {
	context.decodeAudioData(
		request.response,
		function onSuccess(buffer) {
			if(!buffer) {
				$('#info').text('Error decoding file data');
				return;
			}

			sourceJs = context.createScriptProcessor(2048, 1, 1);
			sourceJs.buffer = buffer;
			sourceJs.connect(context.destination);
			analyser = context.createAnalyser();
			analyser.smoothingTimeConstant = 0.6;
			analyser.fftSize = 512;

			source = context.createBufferSource();
			source.buffer = buffer;
			source.loop = true;

			source.connect(analyser);
			analyser.connect(sourceJs);
			source.connect(context.destination);

			sourceJs.onaudioprocess = function(e) {
				array = new Uint8Array(analyser.frequencyBinCount);
				analyser.getByteFrequencyData(array);
				boost = 0;
				for (var i = 0; i < array.length; i++) {
		            boost += array[i];
		        }
		        boost = boost / array.length;
			};

			$('#info')
				.fadeOut('normal', function() {
					$(this).html('<div id="artist"><a class="name" href="https://soundcloud.com/bossfightswe" target="_blank">BOSSFIGHT</a><br /><a class="song" href="https://soundcloud.com/bossfightswe/dr-finkelfrackens-cure" target="_blank">Dr. Finkelfracken\'s Cure</a><br /></div><div><img src="data/art.jpg" width="75" height="75" /></div>');
				})
				.fadeIn();

			clearInterval(interval);
            try{
               source.start(0);
            }
            catch(e) {
               $('#info').text('Error loading song..');
            }
			// popup
			$('#play').css('display', 'inline');
			$('#play').fadeIn();
		},
		function onFailure(error) {
			$('#info').text('Decoding error:' + error);
            // popup
			$('#play').css('display', 'inline');
			$('#play').fadeIn();
		}
	);
};

request.onerror = function() {
	$('#info').text('buffer: XHR error');
};
