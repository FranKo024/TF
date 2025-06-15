document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('imageUpload');
    const originalCanvas = document.getElementById('originalCanvas');
    const filteredCanvas = document.getElementById('filteredCanvas');
    const originalCtx = originalCanvas.getContext('2d');
    const filteredCtx = filteredCanvas.getContext('2d');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const kernelSizeSelect = document.getElementById('kernelSize');
    
    let originalImage = null;
    
    // Event listeners para los botones de filtros
    document.getElementById('medianFilter').addEventListener('click', () => applyFilter('median'));
    document.getElementById('meanFilter').addEventListener('click', () => applyFilter('mean'));
    document.getElementById('laplacianFilter').addEventListener('click', () => applyFilter('laplacian'));
    document.getElementById('sobelFilter').addEventListener('click', () => applyFilter('sobel'));
    
    // Función para cargar y procesar la imagen
    function loadImage(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('Por favor, selecciona un archivo de imagen válido.');
            return;
        }

        const reader = new FileReader();
        
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                // Ajustar el tamaño de los canvas
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
                
                // Dibujar la imagen original
                originalCtx.drawImage(img, 0, 0, width, height);
                filteredCtx.drawImage(img, 0, 0, width, height);
                
                originalImage = img;
                downloadBtn.disabled = false;
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    // Event listener para el input de archivo
    imageUpload.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            loadImage(e.target.files[0]);
        }
    });
    
    // Restablecer imagen
    resetBtn.addEventListener('click', function() {
        if (originalImage) {
            filteredCtx.drawImage(originalImage, 0, 0, originalCanvas.width, originalCanvas.height);
        }
    });
    
    // Descargar imagen filtrada
    downloadBtn.addEventListener('click', function() {
        if (!filteredCanvas) return;
        
        const link = document.createElement('a');
        link.download = 'imagen-filtrada.png';
        link.href = filteredCanvas.toDataURL('image/png');
        link.click();
    });
    
    // Aplicar filtro
    function applyFilter(filterType) {
        if (!originalImage) return;
        
        const kernelSize = parseInt(kernelSizeSelect.value);
        const imageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
        const filteredData = applyImageFilter(imageData, filterType, kernelSize);
        
        filteredCtx.putImageData(filteredData, 0, 0);
    }
    
    // Función principal para aplicar filtros
    function applyImageFilter(imageData, filterType, kernelSize = 3) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        const newData = new ImageData(width, height);
        const output = newData.data;
        
        // Kernel debe ser impar
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
                    // Copiar original si no hay filtro reconocido
                    for (let i = 0; i < 4; i++) {
                        output[pixelPos + i] = data[pixelPos + i];
                    }
                }
            }
        }
        
        return newData;
    }
    
    // Filtro de Mediana
    function applyMedianFilter(x, y, width, height, input, output, pixelPos, kernelRadius) {
        const redValues = [];
        const greenValues = [];
        const blueValues = [];
        
        for (let ky = -kernelRadius; ky <= kernelRadius; ky++) {
            for (let kx = -kernelRadius; kx <= kernelRadius; kx++) {
                const px = Math.min(width - 1, Math.max(0, x + kx));
                const py = Math.min(height - 1, Math.max(0, y + ky));
                const pos = (py * width + px) * 4;
                
                redValues.push(input[pos]);
                greenValues.push(input[pos + 1]);
                blueValues.push(input[pos + 2]);
            }
        }
        
        // Ordenar y obtener el valor de la mediana
        redValues.sort((a, b) => a - b);
        greenValues.sort((a, b) => a - b);
        blueValues.sort((a, b) => a - b);
        
        const medianIndex = Math.floor(redValues.length / 2);
        
        output[pixelPos] = redValues[medianIndex];
        output[pixelPos + 1] = greenValues[medianIndex];
        output[pixelPos + 2] = blueValues[medianIndex];
        output[pixelPos + 3] = 255; // Alpha
    }
    
    // Filtro de Media
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
        output[pixelPos + 3] = 255; // Alpha
    }
    
    // Filtro Laplaciano
    function applyLaplacianFilter(x, y, width, height, input, output, pixelPos) {
        if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
            // Borde - copiar original
            for (let i = 0; i < 4; i++) {
                output[pixelPos + i] = input[pixelPos + i];
            }
            return;
        }
        
        // Kernel Laplaciano (4-vecinos)
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
        
        // Asegurar que los valores estén en el rango 0-255
        output[pixelPos] = Math.min(255, Math.max(0, red));
        output[pixelPos + 1] = Math.min(255, Math.max(0, green));
        output[pixelPos + 2] = Math.min(255, Math.max(0, blue));
        output[pixelPos + 3] = 255; // Alpha
    }
    
    // Filtro Sobel
    function applySobelFilter(x, y, width, height, input, output, pixelPos) {
        if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
            // Borde - copiar original
            for (let i = 0; i < 4; i++) {
                output[pixelPos + i] = input[pixelPos + i];
            }
            return;
        }
        
        // Kernels Sobel
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
        
        let redX = 0, greenX = 0, blueX = 0;
        let redY = 0, greenY = 0, blueY = 0;
        
        for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
                const pos = ((y + ky) * width + (x + kx)) * 4;
                const weightX = kernelX[ky + 1][kx + 1];
                const weightY = kernelY[ky + 1][kx + 1];
                
                // Componente X
                redX += input[pos] * weightX;
                greenX += input[pos + 1] * weightX;
                blueX += input[pos + 2] * weightX;
                
                // Componente Y
                redY += input[pos] * weightY;
                greenY += input[pos + 1] * weightY;
                blueY += input[pos + 2] * weightY;
            }
        }
        
        // Calcular la magnitud del gradiente
        const red = Math.sqrt(redX * redX + redY * redY);
        const green = Math.sqrt(greenX * greenX + greenY * greenY);
        const blue = Math.sqrt(blueX * blueX + blueY * blueY);
        
        // Normalizar y asignar (Sobel suele mostrarse en escala de grises)
        const magnitude = Math.min(255, Math.sqrt(red * red + green * green + blue * blue));
        
        output[pixelPos] = magnitude;
        output[pixelPos + 1] = magnitude;
        output[pixelPos + 2] = magnitude;
        output[pixelPos + 3] = 255; // Alpha
    }
});