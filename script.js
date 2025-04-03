const themeToggle=document.querySelector(".theme-toggle");
const promptBtn=document.querySelector(".prompt-btn");
const promptInput=document.querySelector(".prompt-input");
const promptForm=document.querySelector(".prompt-form"); // Fixed typo in variable name
const modelSelect=document.getElementById("model-select");
const countSelect=document.getElementById("count-select");
const ratioSelect=document.getElementById("ratio-select");
const galleryGrid=document.querySelector(".gallery-grid");
const API_KEY="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";

const examplePrompts=[
    "A futuristic cyberpunk city at night, neon lights reflecting off wet streets, flying cars in the sky.",
    "A medieval dragon perched on top of a castle, fire coming from its mouth, with a stormy sky in the background.",
    "An astronaut exploring an alien planet with glowing blue plants and floating rocks."
];
//set theme based on saved preference or system default 
(() => {
    const savedTheme= localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const isDarkTheme = savedTheme == "dark" || (!savedTheme && systemPrefersDark);
    document.body.classList.toggle("dark-theme",isDarkTheme);
    themeToggle.querySelector("i").className= isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon";
})();
//switch between dark and light theme
const toggleTheme=() =>{
    const isDarkTheme =document.body.classList.toggle("dark-theme");
    themeToggle.querySelector("i").className= isDarkTheme ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

const getImageDimensions=(aspectRatio,baseSize=512)=>{
    const[width,height]=aspectRatio.split("/").map(Number);
    if (isNaN(width) || isNaN(height)) {
        throw new Error("Invalid aspect ratio format. Expected format: 'width/height'.");
    }
    const scaleFactor=baseSize/Math.sqrt(width*height);

    let calculatedWidth=Math.round(width*scaleFactor);
    let calculatedHeight=Math.round(height*scaleFactor);

    calculatedWidth=Math.floor(calculatedWidth/16)*16;
    calculatedHeight=Math.floor(calculatedHeight/16)*16;

    return {width: calculatedWidth, height: calculatedHeight};
}

const updateImageCard=(imgIndex,imgUrl) =>{
    const imgCard=document.getElementById( `img-card-${imgIndex}`);
    if(!imgCard) return;

    imgCard.classList.remove("loading");
    imgCard.innerHTML= ` <img src="${imgUrl}" class="result-img"/>
                    <div class="img-overplay">
                        <a href="${imgUrl}" class="img-download-btn" download="${Date.now()}.png">
                            <i class="fa-solid fa-download"></i>
                        </a>
                    </div>`;
}

// send request to hugging face API to create images
const generateImages = async(selectModel, imageCount, aspectRatio, promptText) => {
    const MODEL_URL = `https://router.huggingface.co/replicate/v1/models/${selectModel}`; // Removed extra double quote
   const {width,height}= getImageDimensions(aspectRatio);

   // create an array of image generation promises
   const imagePromises=Array.from({length:imageCount},async(_,i)=>{
    //send request to the AI model API
    try {
        const response = await fetch(MODEL_URL,{
            headers:{
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                inputs: promptText,
                parameters:{width,height},
                options:{wait_for_model:true,user_cache:false},
            }),
        });

        if(!response.ok) {
            const errorResponse = await response.json().catch(() => ({ error: "Unknown error" })); // Added fallback for non-JSON responses
            throw new Error(errorResponse.error);
        }

        // convert response to an image URL and update the image card
        const result=await response.blob();
        updateImageCard(i,URL.createObjectURL(result));
    } catch(error) {
        console.error(`Error generating image ${i + 1}:`, error.message);
    }
   })
  await Promise.allSettled(imagePromises);  
};

//Create placeHolder cards with loading spinners
const createImageCards = (selectModel, imageCount, aspectRatio, promptText) => {
    galleryGrid.innerHTML = ""; // Clear existing cards to avoid duplicates
    for (let i = 0; i < imageCount; i++) {
        galleryGrid.innerHTML += `<div class="img-card loading" id="img-card-${i}" style="aspect-ratio: ${aspectRatio}">
                     <div class="status-container">
                        <div class="spinner"></div>
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <p class="status-text">Generating image for: "${promptText}" using model: "${selectModel}"</p>
                    </div>
                    </div>`;
    }

    generateImages(selectModel, imageCount, aspectRatio, promptText);
};

//Handle form submission
const handleFormSubmit = (e) =>{
    e.preventDefault(); //preventing from default submission

    // get form values
    const selectModel=modelSelect.value;
    const imageCount=parseInt(countSelect.value) || 1;
    const aspectRatio=ratioSelect.value || "1/1";
    const promptText=promptInput.value.trim();

    createImageCards(selectModel,imageCount,aspectRatio,promptText);
}
//fill prompt with random example
const btnPrompt =() =>{
    const prompt=examplePrompts[Math.floor(Math.random()* examplePrompts.length)];
    promptInput.value=prompt;
    promptInput.focus();
};

promptForm.addEventListener("submit",handleFormSubmit);
themeToggle.addEventListener("click",toggleTheme);
promptBtn.addEventListener("click",btnPrompt);