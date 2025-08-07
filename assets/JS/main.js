let page = 1;
let isLoading = false;

const loading_container = document.querySelector(".LoaderContainer");
const loader = document.querySelector(".loader");

/*......................This function is to get data from the API...................*/

async function getImages() {
    try {
        const elements = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=12`);
        const data = await elements.json();
        return data;
    } catch (error) {
        console.log(error);
        return [];
    }
}


/*......................This function is to put the data into html code...................*/

const structurePage = async function () {
    if (isLoading) return;
    isLoading = true;

    // Show loader
    loader.classList.remove("StopLoader");
    loading_container.classList.remove("StopLoader");

    try {
        const images = await getImages();

        for(let i=0;i<images.length;i+=6){
            const group=images.slice(i, i+6);

            document.querySelector("main #images").innerHTML += `
            <div class="ImageRow">
                <div class="GridStyle">
                    <div class="ImageWrapper SingleImgDiv">
                        <img src='${group[0].download_url}' alt='${group[0].author}' title='${group[0].author}' loading="lazy">
                    </div>
                    <div class="TwoImgDiv">
                        <div class="ImageWrapper">
                            <img src='${group[1].download_url}' alt='${group[1].author}' title='${group[1].author}' loading="lazy">
                        </div>
                        <div class="ImageWrapper">
                            <img src='${group[2].download_url}' alt='${group[2].author}' title='${group[2].author}' loading="lazy">
                        </div>
                    </div>
                </div>


                <div class="GridStyle">
                    <div class="TwoImgDiv">
                        <div class="ImageWrapper">
                            <img src='${group[3].download_url}' alt='${group[3].author}' title='${group[3].author}' loading="lazy">
                        </div>
                        <div class="ImageWrapper">
                            <img src='${group[4].download_url}' alt='${group[4].author}' title='${group[4].author}' loading="lazy">
                        </div>
                    </div>
                    <div class="ImageWrapper SingleImgDiv">
                        <img src='${group[5].download_url}' alt='${group[5].author}' title='${group[5].author}' loading="lazy">
                    </div>
                </div>
            </div>
            `
        }

        modal();
        
    } catch (error) {
        console.log(error);
    } finally {
        // Hide loader and release lock
        loader.classList.add("StopLoader");
        loading_container.classList.add("StopLoader");
        isLoading = false;
    }
};

structurePage();

/*................................For infinite scroll and fetching with each page ends........................................*/
window.onscroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const threshold = document.documentElement.scrollHeight - 100;

    if (!isLoading && scrollPosition >= threshold) {
        page++;
        structurePage();
    }
};


/*.................................Modal..............................*/

 function modal(){

    const modal= document.querySelector('.modal');
    const imgs = Array.from(document.querySelectorAll(".ImageWrapper img"));
    const closeBtn=document.querySelector('.CloseButtonWrapper button');


    imgs.forEach(function(img) {
        img.addEventListener("click", function(e) {

            document.querySelector('.modal').classList.remove('DisplayNoneModal');

            const currentImage = e.target;
            console.log("clicked images "+currentImage.title);

            modal.querySelector(".ImageModal .ImgOptions").innerHTML = `
                <span>${currentImage.getAttribute('title')}</span>
                <button id="DownloadBtn">
                    <i class="fa-solid fa-download"></i>
                </button>
            `;
            
            document.getElementById("DownloadBtn").addEventListener("click", async function() {
                const imageURL = currentImage.src;

                try {
                    const response=await fetch(imageURL,{mode:'cors'});
                    const blob=await response.blob();
                    const blobTempURL=await URL.createObjectURL(blob);

                    const link =document.createElement('a');
                    link.href=blobTempURL;
                    link.download=`${currentImage.getAttribute('title')||"image"}.jpg`;
                    link.click();

                    URL.revokeObjectURL(blobTempURL);
                } catch (error) {
                    console.error("Download failed:", error);
                    alert("Unable to download image due to cross-origin restrictions \"CORS\".");
                }
            });

            modal.querySelector(".ImageModal .ImageWrapper").innerHTML = `
            <img src="${currentImage.src}" alt="${currentImage.alt}" title="${currentImage.title}"/>
            `;
        });
    });


    closeBtn.addEventListener("click",function(e){
        modal.classList.add('DisplayNoneModal');
    })


 }