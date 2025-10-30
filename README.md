# AI Image Generator

A browser-based AI image generator using Hugging Face's Inference API.

## Setup Instructions

### 1. Get Your Hugging Face API Key

1. Go to [Hugging Face](https://huggingface.co/)
2. Sign up or log in to your account
3. Navigate to your account settings
4. Go to "Access Tokens" section
5. Create a new token (select "Read" access is sufficient)
6. Copy your API token

### 2. Configure the API Key

Open `script.js` and replace the placeholder on line 11:

```javascript
const API_KEY = "YOUR_HUGGING_FACE_API_KEY_HERE";
```

With your actual API key:

```javascript
const API_KEY = "hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
```

### 3. Run the Application

Simply open `index.html` in your web browser. No build process or server required!

## Features

- Multiple AI models to choose from (FLUX, Stable Diffusion, etc.)
- Adjustable aspect ratios (Square, Landscape, Portrait)
- Generate multiple images at once (1-4 images)
- Dark/Light theme toggle
- Random prompt suggestions
- Download generated images

## Troubleshooting

### Images not generating?

1. **Check API Key**: Make sure you've added your Hugging Face API key in `script.js`
2. **Check Console**: Open browser DevTools (F12) and check the Console tab for errors
3. **Model Loading**: Some models may take time to load. The API returns errors if models are loading
4. **Rate Limits**: Free tier has rate limits. Wait a few moments between requests

### CORS Errors?

The application works directly in the browser. If you see CORS errors, make sure you're accessing the HTML file properly (not via `file://` protocol for some browsers). Consider using a simple local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

## Available Models

- **FLUX.1-dev**: High-quality image generation
- **FLUX.1-schnell**: Fast image generation
- **Stable Diffusion XL**: Advanced stable diffusion
- **Stable Diffusion v1.5**: Classic stable diffusion
- **OpenJourney**: Artistic style generation

## License

MIT License - Feel free to use and modify as needed.
