let backBtn=document.querySelector("#back");
let database;
let noOfMedia=0;

let req=indexedDB.open("Gallery",2);               //opening the database

req.addEventListener("success",function(){                 
    database=req.result;                           //storing the result of opening database
})

req.addEventListener("upgradeneeded",function(){
    let db=req.result;
    db.createObjectStore("media",{keyPath:"mId"});           //creating an object store
})

req.addEventListener("error",function(){})

function saveMedia(media){
    if(!database){
        return;
    }

    let data={                         //data object to be stored
        mId:Date.now(),
        mediaData:media,
    }

    let tx=database.transaction("media","readwrite");            //transaction object of read write type
    let mediaObjectStore=tx.objectStore("media");                //returns an object store that has already been added to the scope of this transaction.
    mediaObjectStore.add(data);
}

function viewMedia(){
    if(!database){
        return;
    }

    let galleryContainer=document.querySelector(".gallery-container");
    let tx=database.transaction("media","readonly");
    let mediaObjectStore=tx.objectStore("media");  

    let req=mediaObjectStore.openCursor();                   //used to iterate over records in database

    req.addEventListener("success",function(){
        cursor=req.result;

        if(cursor){
            noOfMedia++;
            let mediaCard=document.createElement("div");
            mediaCard.classList.add("media-card");

            mediaCard.innerHTML=`<div class="actual-media"></div>
            <div class="media-buttons">
                <button class="media-download"><span class="material-icons"> file_download </span></button>
                <button data-mid="${cursor.value.mId}" class="media-delete"><span class="material-icons"> delete </span></button>
            </div>`

            let data=cursor.value.mediaData;

            let actualMediaDiv=mediaCard.querySelector(".actual-media");

            let downloadBtn=mediaCard.querySelector(".media-download");

            let deleteBtn=mediaCard.querySelector(".media-delete");

            deleteBtn.addEventListener("click",function(e){
                let mId=Number(e.currentTarget.getAttribute("data-mId"));
                deleteMedia(mId);
                e.currentTarget.parentElement.parentElement.remove();
            })

            let type=typeof data;

            if(type=="string"){
                //image
                let image=document.createElement("img");
                image.src=data;

                downloadBtn.addEventListener("click",function(e){
                    downloadMedia(data,"image")
                })

                actualMediaDiv.append(image);
            }

            else if(type=="object"){
                //video
                let video=document.createElement("video");
                let url=URL.createObjectURL(data);                //creating the video url
                video.src=url;

                downloadBtn.addEventListener("click",function(e){
                    downloadMedia(url,"video")
                })

                video.autoplay=true;
                video.loop=true;
                video.controls=true;

                actualMediaDiv.append("video");
            }

            galleryContainer.append(mediaCard);
            cursor.continue();
        }

        else{
            if(noOfMedia==0){
                galleryContainer.innerText="No Media Available";
                galleryContainer.style.textAlign="center";
                galleryContainer.style.fontSize="xx-large";
                galleryContainer.style.color="white";
            }
        }
    })
}

function downloadMedia(url,type){
    let a=document.createElement("a");
    a.href=url;
    
    if(type=="image"){
        a.download="image.png";
    }

    else{
        a.download="video.mp4";
    }

    a.click();
    a.remove();
}

function deleteMedia(mId){
    let tx=database.transaction("media","readwrite");
    let mediaStore=tx.objectStore("media");
    mediaStore.delete(mId);
}

backBtn.addEventListener("click",function(e){
    location.assign("index.html");
})