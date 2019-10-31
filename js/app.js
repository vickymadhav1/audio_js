//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record
var url = 'http://15.206.138.110:8085/post/?name='

var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");
var read_text = document.getElementById("read_text");
var submitButton = document.getElementById("submitButton");
var formSubmitButton = document.getElementById("form_submitBtn");
//add events to those 2 buttons
var constraints = { audio: true, video: false }
var blob_list = {}
window.permission = 0
function mycall() {
	window.permission = navigator.mediaDevices.getUserMedia(constraints);
	console.log(window.permission);
	return window.permission

}

// $('#myModal').modal({
//     backdrop: 'static',
//     keyboard: false
// })



//var permission = navigator.mediaDevices.getUserMedia(constraints)
var file_path = []
var headers = {
	"Access-Control-Allow-Origin": "*", // Required for CORS support to work
	"Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS 
}
var cond = false;
var array = ["one", "two", "three", "four", "five", "six"]
var i = 0;
//i < arrayLength;
console.log(array[i], i);
var para = document.getElementById('p_tag');
para.innerHTML = array[i]
//para.appendChild(node)
//read_text.appendChild(para)
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
submitButton.addEventListener("click", upload);
stopButton.addEventListener("click", function () {
	i++
	recordButton.disabled = false;
	if (i < array.length) {
		para.innerHTML = array[i];
	}
	else {
		para.innerHTML = 'Thank you!';
		recordButton.disabled = true;
		stopButton.disabled = true;
		pauseButton.disabled = true;
		submitButton.disabled = false;

	}
});
pauseButton.addEventListener("click", pauseRecording);

;
function flow(item) {
	stopRecording;
	para.innerHTML = item;
	recordButton.disabled = false;

}

function upload() {
	var name = makeid(8)
	var fd = new FormData();
	for (var key in blob_list) {
		fd.append(key, blob_list[key]);
		fd.append("name", name + '_' + key);
	}
	var age = 18
	var pob = 'india'
	var sex = 'male'
	console.log('uploaded Successfully')
	var xhr = new XMLHttpRequest();
	var req_url = url + name + '&age=' + age + '&pob=' + pob + '&sex=' + sex
	xhr.open("POST", req_url, false);
	xhr.send(fd);

}

function startRecording() {
	console.log("recordButton clicked");

	var constraints = { audio: true, video: false }

	/*
	  Disable the record button until we get a success or fail from getUserMedia() 
  */

	recordButton.disabled = true;
	stopButton.disabled = false;
	pauseButton.disabled = false

	/*
    	We're using the standard promise based getUserMedia() 
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

	window.permission.then(function (stream) {
		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

		audioContext = new AudioContext();

		/*  assign to gumStream for later use  */
		gumStream = stream;
		
		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);
		/* 
			Create the Recorder object and configure to record mono sound (1 channel)
			Recording 2 channels  will double the file size
		*/
		rec = new Recorder(input, { numChannels: 1 })

		//start the recording process
		rec.record()

		console.log("Recording started");

	}).catch(function (err) {
		//enable the record button if getUserMedia() fails
		recordButton.disabled = false;
		stopButton.disabled = true;
		pauseButton.disabled = true
	});
}

function pauseRecording() {
	console.log("pauseButton clicked rec.recording=", rec.recording);
	if (rec.recording) {
		//pause
		rec.stop();
		pauseButton.innerHTML = "Resume";
	} else {
		//resume
		rec.record()
		pauseButton.innerHTML = "Pause";

	}
}

function stopRecording() {
	console.log("stopButton clicked");

	//disable the stop button, enable the record too allow for new recordings
	stopButton.disabled = true;
	recordButton.disabled = false;
	//pauseButton.disabled = true;

	//reset button just in case the recording is stopped while paused
	pauseButton.innerHTML = "Pause";

	//tell the recorder to stop the recording
	rec.stop();

	//stop microphone access
	gumStream.getAudioTracks()[0].stop();

	//create the wav blob and pass it on to createDownloadLink
	rec.exportWAV(createDownloadLink);
}

function makeid(length) {
	var result = '';
	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for (var i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

function createDownloadLink(blob) {

	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('li');
	var link = document.createElement('a');

	//name of .wav file to use during upload and download (without extendion)
	var filename = new Date().toISOString();

	//add controls to the <audio> element
	au.controls = true;
	au.src = url;

	//save to disk link
	link.href = url;
	//link.innerHTML = "Save to disk";

	//add the new audio element to li
	li.appendChild(au);

	//add the filename to the li
	li.appendChild(document.createTextNode(""))

	//add the save to disk link to li
	li.appendChild(link, "C:/xampp/tmp/");
	recordingsList.appendChild(li);
	blob_list[i] = blob
}
