let videoPlayer=document.querySelector("video");
let recordBtn=document.querySelector("#record");
let captureBtn=document.querySelector("#capture");
let galleryBtn=document.querySelector("#gallery");
let zoomIn=document.querySelector(".zoom-in");
let zoomOut=document.querySelector(".zoom-out");

let body=document.querySelector("body");

let filter;

let promiseToUseCamera=navigator.mediaDevices.getUserMedia({
    audio:true,
    video:true,
})

let chunks=[];
let mediaRecorder;
let isRecording=false;
let currZoom=1;

recordBtn.addEventListener("click",function(e){
    let innerspan=recordBtn.querySelector("span");
    if(isRecording){
        mediaRecorder.stop();
        innerspan.removeAttribute("id");
        isRecording=false;
    }

    else{
        mediaRecorder.start();
        innerspan.setAttribute('id',"rec-animation");
        isRecording=true;
    }
})

captureBtn.addEventListener("click",function(e){
    let innerspan=captureBtn.querySelector("span");
    innerspan.setAttribute('id',"capture-animation");

    setTimeout(function(){
        innerspan.removeAttribute("id");
    },1000);

    let canvas=document.createElement("canvas");

    canvas.width=videoPlayer.videoWidth;
    canvas.height=videoPlayer.videoHeight;

    let tool=canvas.getContext("2d");

    //canvas origin co-ordianates from top left to center
    tool.translate(canvas.width/2,canvas.width/2);

    //stretch the canvas
    tool.scale(currZoom,currZoom);

    //tool back to original position
    tool.translate(-canvas.width/2,-canvas.width/2);

    tool.drawImage(videoPlayer,0,0);

    if(filter!="" && filter){
        tool.fillStyle=filter;
        tool.fillRect(0,0,canvas.width,canvas.height);
    }

    let url=canvas.toDataURL();

    saveMedia(url);
})

zoomIn.addEventListener("click",function(e){
    currZoom=currZoom+0.1;

    if(currZoom>3){
        currZoom=3;
    }

    console.log(currZoom);
    videoPlayer.style.transform=`scale(${currZoom})`;
})

zoomOut.addEventListener("click",function(e){
    currZoom=currZoom-0.1;

    if(currZoom<1){
        currZoom=1;
    }

    console.log(currZoom);
    videoPlayer.style.transform=`scale(${currZoom})`;
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

        saveMedia(blob);
    })
})

.catch(function(){
    console.log("User Denied Access");
})