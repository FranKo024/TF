document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('imageUpload');
    const originalCanvas = document.getElementById('originalCanvas');
    const filteredCanvas = document.getElementById('filteredCanvas');
    const originalCtx = originalCanvas.getContext('2d');
    const filteredCtx = filteredCanvas.getContext('2d');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const kernelSizeSelect = document.getElementById('kernelSize');
    
    const laplacianKernelImg = document.createElement('img');
    laplacianKernelImg.src = 'images/laplacianKernel.png';
    laplacianKernelImg.style.display = 'none';
    laplacianKernelImg.style.maxWidth = '200px';
    laplacianKernelImg.style.margin = '10px';
    laplacianKernelImg.id = 'laplacianKernelImg';
    
    const sobelKernelImg = document.createElement('img');
    sobelKernelImg.src = 'images/sobelKernel.png';
    sobelKernelImg.style.display = 'none';
    sobelKernelImg.style.maxWidth = '400px';
    sobelKernelImg.style.margin = '10px';
    sobelKernelImg.id = 'sobelKernelImg';
    
    const kernelSizeImg = document.createElement('img');
    kernelSizeImg.style.display = 'none';
    kernelSizeImg.style.maxWidth = '300px';
    kernelSizeImg.style.margin = '10px';
    kernelSizeImg.id = 'kernelSizeImg';
    
    document.querySelector('.filters').appendChild(laplacianKernelImg);
    document.querySelector('.filters').appendChild(sobelKernelImg);
    document.querySelector('.filters').appendChild(kernelSizeImg);
    
    let originalImage = null;
    
    document.getElementById('medianFilter').addEventListener('click', () => {
        hideAllKernelImages();
        kernelSizeImg.style.display = 'block';
        updateKernelSizeImage('median');
        applyFilter('median');
    });
    document.getElementById('meanFilter').addEventListener('click', () => {
        hideAllKernelImages();
        kernelSizeImg.style.display = 'block';
        updateKernelSizeImage('mean');
        applyFilter('mean');
    });
    document.getElementById('laplacianFilter').addEventListener('click', () => {
        hideAllKernelImages();
        kernelSizeImg.style.display = 'block';
        updateKernelSizeImage('laplacian');
        applyFilter('laplacian');
    });
    document.getElementById('sobelFilter').addEventListener('click', () => {
        hideAllKernelImages();
        kernelSizeImg.style.display = 'block';
        updateKernelSizeImage('sobel');
        applyFilter('sobel');
    });
    
    function hideAllKernelImages() {
        laplacianKernelImg.style.display = 'none';
        sobelKernelImg.style.display = 'none';
        kernelSizeImg.style.display = 'none';
        const existingContainer = document.querySelector('.sobel7x7-container');
        if (existingContainer) {
            existingContainer.remove();
        }
    }
    
    function updateKernelSizeImage(filterType) {
        const size = kernelSizeSelect.value;
        if (filterType === 'sobel') {
            const existingContainer = document.querySelector('.sobel7x7-container');
            if (existingContainer) {
                existingContainer.remove();
            }
            if (size === '5') {
                kernelSizeImg.style.display = 'block';
                kernelSizeImg.src = 'images/sobel5x5.png';
            } else if (size === '7') {
                kernelSizeImg.style.display = 'none';
                const sobel7x7Container = document.createElement('div');
                sobel7x7Container.style.display = 'flex';
                sobel7x7Container.style.gap = '20px';
                sobel7x7Container.style.justifyContent = 'center';
                
                const sobel7x7X = document.createElement('img');
                sobel7x7X.src = 'images/sobel7x7_x.png';
                sobel7x7X.style.maxWidth = '300px';
                
                const sobel7x7Y = document.createElement('img');
                sobel7x7Y.src = 'images/sobel7x7_y.png';
                sobel7x7Y.style.maxWidth = '300px';
                
                sobel7x7Container.className = 'sobel7x7-container';
                sobel7x7Container.appendChild(sobel7x7X);
                sobel7x7Container.appendChild(sobel7x7Y);
                document.querySelector('.filters').appendChild(sobel7x7Container);
            } else {
                kernelSizeImg.style.display = 'block';
                kernelSizeImg.src = 'images/sobelKernel.png';
            }
        } else if (filterType === 'laplacian') {
            if (size === '5') {
                kernelSizeImg.src = 'images/laplacian5x5.png';
            } else if (size === '7') {
                kernelSizeImg.src = 'images/laplacian7x7.png';
            } else {
                kernelSizeImg.src = 'images/laplacianKernel.png';
            }
            kernelSizeImg.style.display = 'block';
        } else {
            const existingContainer = document.querySelector('.sobel7x7-container');
            if (existingContainer) {
                existingContainer.remove();
            }
            kernelSizeImg.style.display = 'block';
            kernelSizeImg.src = `images/${size}x${size}kernel.png`;
        }
    }
    
    function handleKernelSizeChange(filterType) {
        if (filterType === 'laplacian') {
            kernelSizeSelect.disabled = false;
            updateKernelSizeImage(filterType);
        } else if (filterType === 'sobel') {
            kernelSizeSelect.disabled = false;
            updateKernelSizeImage(filterType);
        } else {
            kernelSizeSelect.disabled = false;
            updateKernelSizeImage(filterType);
        }
    }
    
    kernelSizeSelect.addEventListener('change', () => {
        const activeFilter = document.querySelector('.filters button.active')?.id.replace('Filter', '');
        if (activeFilter) {
            updateKernelSizeImage(activeFilter);
        }
    });
    
    function loadImage(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('Por favor, selecciona un archivo de imagen válido.');
            return;
        }

        const reader = new FileReader();
        
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const maxWidth = 500;
                const maxHeight = 500;
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth) {
                    height = (maxWidth / width) * height;
                    width = maxWidth;
                }
                
                if (height > maxHeight) {
                    width = (maxHeight / height) * width;
                    height = maxHeight;
                }
                
                originalCanvas.width = width;
                originalCanvas.height = height;
                filteredCanvas.width = width;
                filteredCanvas.height = height;
                
                originalCtx.drawImage(img, 0, 0, width, height);
                filteredCtx.drawImage(img, 0, 0, width, height);
                
                originalImage = img;
                downloadBtn.disabled = false;
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    imageUpload.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            loadImage(e.target.files[0]);
        }
    });
    
    resetBtn.addEventListener('click', function() {
        if (originalImage) {
            filteredCtx.drawImage(originalImage, 0, 0, originalCanvas.width, originalCanvas.height);
        }
    });
    
    downloadBtn.addEventListener('click', function() {
        if (!filteredCanvas) return;
        
        const link = document.createElement('a');
        link.download = 'imagen-filtrada.png';
        link.href = filteredCanvas.toDataURL('image/png');
        link.click();
    });
    
    function applyFilter(filterType) {
        if (!originalImage) return;
        
        const kernelSize = parseInt(kernelSizeSelect.value);
        const imageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
        const filteredData = applyImageFilter(imageData, filterType, kernelSize);
        
        filteredCtx.putImageData(filteredData, 0, 0);
    }
    
    function applyImageFilter(imageData, filterType, kernelSize = 3) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        const newData = new ImageData(width, height);
        const output = newData.data;
        
        const kernelRadius = Math.floor(kernelSize / 2);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const pixelPos = (y * width + x) * 4;
                
                if (filterType === 'median') {
                    applyMedianFilter(x, y, width, height, data, output, pixelPos, kernelRadius);
                } else if (filterType === 'mean') {
                    applyMeanFilter(x, y, width, height, data, output, pixelPos, kernelRadius);
                } else if (filterType === 'laplacian') {
                    applyLaplacianFilter(x, y, width, height, data, output, pixelPos);
                } else if (filterType === 'sobel') {
                    applySobelFilter(x, y, width, height, data, output, pixelPos);
                } else {
                    for (let i = 0; i < 4; i++) {
                        output[pixelPos + i] = data[pixelPos + i];
                    }
                }
            }
        }
        
        return newData;
    }
    
    function applyMedianFilter(x, y, width, height, input, output, pixelPos, kernelRadius) {
        const values = new Array((2 * kernelRadius + 1) * (2 * kernelRadius + 1));
        const kernelSize = values.length;
        
        function findMedian(arr, len) {
            const mid = Math.floor(len / 2);
            let left = 0;
            let right = len - 1;
            
            while (left < right) {
                const pivot = arr[Math.floor((left + right) / 2)];
                let i = left - 1;
                let j = right + 1;
                
                while (true) {
                    do i++; while (arr[i] < pivot);
                    do j--; while (arr[j] > pivot);
                    if (i >= j) break;
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                }
                
                if (j < mid) left = j + 1;
                else right = j;
            }
            
            return arr[mid];
        }
        
        let idx = 0;
        for (let ky = -kernelRadius; ky <= kernelRadius; ky++) {
            for (let kx = -kernelRadius; kx <= kernelRadius; kx++) {
                const px = Math.min(width - 1, Math.max(0, x + kx));
                const py = Math.min(height - 1, Math.max(0, y + ky));
                const pos = (py * width + px) * 4;
                values[idx++] = input[pos];
            }
        }
        output[pixelPos] = findMedian(values, kernelSize);
        
        idx = 0;
        for (let ky = -kernelRadius; ky <= kernelRadius; ky++) {
            for (let kx = -kernelRadius; kx <= kernelRadius; kx++) {
                const px = Math.min(width - 1, Math.max(0, x + kx));
                const py = Math.min(height - 1, Math.max(0, y + ky));
                const pos = (py * width + px) * 4;
                values[idx++] = input[pos + 1];
            }
        }
        output[pixelPos + 1] = findMedian(values, kernelSize);
        
        idx = 0;
        for (let ky = -kernelRadius; ky <= kernelRadius; ky++) {
            for (let kx = -kernelRadius; kx <= kernelRadius; kx++) {
                const px = Math.min(width - 1, Math.max(0, x + kx));
                const py = Math.min(height - 1, Math.max(0, y + ky));
                const pos = (py * width + px) * 4;
                values[idx++] = input[pos + 2];
            }
        }
        output[pixelPos + 2] = findMedian(values, kernelSize);
        
        output[pixelPos + 3] = 255;
    }
    
    function applyMeanFilter(x, y, width, height, input, output, pixelPos, kernelRadius) {
        let redSum = 0, greenSum = 0, blueSum = 0;
        let count = 0;
        
        for (let ky = -kernelRadius; ky <= kernelRadius; ky++) {
            for (let kx = -kernelRadius; kx <= kernelRadius; kx++) {
                const px = Math.min(width - 1, Math.max(0, x + kx));
                const py = Math.min(height - 1, Math.max(0, y + ky));
                const pos = (py * width + px) * 4;
                
                redSum += input[pos];
                greenSum += input[pos + 1];
                blueSum += input[pos + 2];
                count++;
            }
        }
        
        output[pixelPos] = redSum / count;
        output[pixelPos + 1] = greenSum / count;
        output[pixelPos + 2] = blueSum / count;
        output[pixelPos + 3] = 255;
    }
    
    function applyLaplacianFilter(x, y, width, height, input, output, pixelPos) {
        if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
            for (let i = 0; i < 4; i++) {
                output[pixelPos + i] = input[pixelPos + i];
            }
            return;
        }
        
        const kernel = [
            [0, -1, 0],
            [-1, 4, -1],
            [0, -1, 0]
        ];
        
        let red = 0, green = 0, blue = 0;
        
        for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
                const pos = ((y + ky) * width + (x + kx)) * 4;
                const weight = kernel[ky + 1][kx + 1];
                
                red += input[pos] * weight;
                green += input[pos + 1] * weight;
                blue += input[pos + 2] * weight;
            }
        }
        
        const normalize = (val) => {
            return Math.min(255, Math.max(0, val + 128));
        };
        
        output[pixelPos] = normalize(red);
        output[pixelPos + 1] = normalize(green);
        output[pixelPos + 2] = normalize(blue);
        output[pixelPos + 3] = 255;
    }
    
    function applySobelFilter(x, y, width, height, input, output, pixelPos) {
        if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
            for (let i = 0; i < 4; i++) {
                output[pixelPos + i] = input[pixelPos + i];
            }
            return;
        }
        
        const kernelX = [
            [-1, 0, 1],
            [-2, 0, 2],
            [-1, 0, 1]
        ];
        
        const kernelY = [
            [-1, -2, -1],
            [0, 0, 0],
            [1, 2, 1]
        ];
        
        let gx = 0, gy = 0;
        
        for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
                const pos = ((y + ky) * width + (x + kx)) * 4;
                const gray = (input[pos] + input[pos + 1] + input[pos + 2]) / 3;
                
                gx += gray * kernelX[ky + 1][kx + 1];
                gy += gray * kernelY[ky + 1][kx + 1];
            }
        }
        
        const magnitude = Math.sqrt(gx * gx + gy * gy);
        const normalizedMagnitude = Math.min(255, Math.max(0, magnitude * 4));
        
        output[pixelPos] = normalizedMagnitude;
        output[pixelPos + 1] = normalizedMagnitude;
        output[pixelPos + 2] = normalizedMagnitude;
        output[pixelPos + 3] = 255;
    }
    
    document.querySelectorAll('.filters button').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.filters button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
});