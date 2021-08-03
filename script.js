let videoPlayer=document.querySelector("video");
let recordBtn=document.querySelector("#record");
let captureBtn=document.querySelector("#capture");
let galleryBtn=document.querySelector("#gallery");

let body=document.querySelector("body");

let filter;

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

captureBtn.addEventListener("click",function(e){
    let canvas=document.createElement("canvas");

    canvas.width=videoPlayer.videoWidth;
    canvas.height=videoPlayer.videoHeight;

    let tool=canvas.getContext("2d");

    tool.drawImage(videoPlayer,0,0);

    if(filter!=""){
        tool.fillStyle=filter;
        tool.fillRect(0,0,canvas.width,canvas.height);
    }

    let url=canvas.toDataURL();

    let a=document.createElement("a");
    a.href=url;

    a.download="image.png";
    a.click();
    a.remove();
})

galleryBtn.addEventListener("click",function(e){
    location.assign("gallery.html");
})

let allFilters=document.querySelectorAll(".filter");

for(let i=0;i<allFilters.length;i++){
    allFilters[i].addEventListener("click",function(e){
        let previousFilter=document.querySelector(".filter-div");

        if(previousFilter){
            previousFilter.remove();
        }

        let color=e.currentTarget.style.backgroundColor;
        filter=color;
        let div=document.createElement("div");
        div.classList.add("filter-div");
        div.style.backgroundColor=color;
        body.append(div);
    })
}

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