const form = document.getElementById('uploadForm');
const loadingMessage = document.getElementById('loadingMessage');
const uploadedImageContainer = document.getElementById('uploadedImageContainer');
const processedImageContainer = document.getElementById('processedImageContainer');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Display loading message
    loadingMessage.style.display = 'block';

    const formData = new FormData();
    formData.append('imageFile', document.getElementById('imageFile').files[0]);

    try {
        const response = await fetch('http://127.0.0.1:5000/remove-background', {
            method: 'POST',
            body: formData
        });


        if (response.ok) {
    // Get the binary image data from the response
    const imageBlob = await response.blob();

    // Create a blob URL for the image data
    const imageUrl = URL.createObjectURL(imageBlob);

    // Display the uploaded image
    uploadedImageContainer.innerHTML = `<img src="${URL.createObjectURL(document.getElementById('imageFile').files[0])}" alt="Uploaded image">`;

    // Display the processed image
    processedImageContainer.innerHTML = `<img src="${imageUrl}" alt="Processed image">`;

    // Add download button for the processed image
    addDownloadButton(imageUrl);
} else {
    alert('Background removal failed');
}

    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again');
    } finally {
        // Hide loading message
        loadingMessage.style.display = 'none';
    }
});

function addDownloadButton(imageUrl) {
    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = imageUrl;
    downloadLink.download = 'background_removed_image.png'; // You can specify the filename here
    downloadLink.textContent = 'Download'; // Text content of the link

    // Append the download link to the processed image container
    processedImageContainer.appendChild(downloadLink);
}

