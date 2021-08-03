let videoPlayer=document.querySelector("video");
let recordBtn=document.querySelector("#record");

let promiseToUseCamera=navigator.mediaDevices.getUserMedia({
    audio:true,
    video:true,
})

let chunks=[];
let mediaRecorder;
let isRecording=false;

recordBtn.addEventListener("click",function(e){
    if(isRecording){
        mediaRecorder.stop();
        isRecording=false;
    }

    else{
        mediaRecorder.start();
        isRecording=true;
    }
})

promiseToUseCamera.then(function(mediaStream){
    videoPlayer.srcObject=mediaStream; 

    mediaRecorder=new MediaRecorder(mediaStream);

    mediaRecorder.addEventListener("dataavailable",function(e){
        chunks.push(e.data);
    })

    mediaRecorder.addEventListener("stop",function(e){
        let blob=new Blob(chunks, {type : "video.mp4"});
        chunks=[];

        let link=URL.createObjectURL(blob);
        let a=document.createElement("a");
        a.href=link;
        a.download="video.mp4";
        a.click();
        a.remove();
    })
})

.catch(function(){
    console.log("User Denied Access");
})