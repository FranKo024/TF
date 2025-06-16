document.addEventListener('DOMContentLoaded', function() {
    const subidaImagen = document.getElementById('subidaImagen');
    const lienzoOriginal = document.getElementById('lienzoOriginal');
    const lienzoFiltrado = document.getElementById('lienzoFiltrado');
    const contextoOriginal = lienzoOriginal.getContext('2d');
    const contextoFiltrado = lienzoFiltrado.getContext('2d');
    const botonReiniciar = document.getElementById('botonReiniciar');
    const botonDescargar = document.getElementById('botonDescargar');
    const selectorTamanoKernel = document.getElementById('selectorTamanoKernel');
    
    const imagenKernelLaplaciano = document.createElement('img');
    imagenKernelLaplaciano.src = 'images/laplacianKernel.png';
    imagenKernelLaplaciano.style.display = 'none';
    imagenKernelLaplaciano.style.maxWidth = '200px';
    imagenKernelLaplaciano.style.margin = '10px';
    imagenKernelLaplaciano.id = 'laplacianKernelImg';
    
    const imagenKernelSobel = document.createElement('img');
    imagenKernelSobel.src = 'images/sobelKernel.png';
    imagenKernelSobel.style.display = 'none';
    imagenKernelSobel.style.maxWidth = '400px';
    imagenKernelSobel.style.margin = '10px';
    imagenKernelSobel.id = 'sobelKernelImg';
    
    const imagenTamanoKernel = document.createElement('img');
    imagenTamanoKernel.style.display = 'none';
    imagenTamanoKernel.style.maxWidth = '300px';
    imagenTamanoKernel.style.margin = '10px';
    imagenTamanoKernel.id = 'kernelSizeImg';
    
    document.querySelector('.filtros').appendChild(imagenKernelLaplaciano);
    document.querySelector('.filtros').appendChild(imagenKernelSobel);
    document.querySelector('.filtros').appendChild(imagenTamanoKernel);
    
    let imagenOriginal = null;
    
    document.getElementById('filtroMediana').addEventListener('click', () => {
        ocultarImagenesKernel();
        imagenTamanoKernel.style.display = 'block';
        actualizarImagenTamanoKernel('mediana');
        aplicarFiltro('mediana');
    });
    document.getElementById('filtroMedia').addEventListener('click', () => {
        ocultarImagenesKernel();
        imagenTamanoKernel.style.display = 'block';
        actualizarImagenTamanoKernel('media');
        aplicarFiltro('media');
    });
    document.getElementById('filtroLaplaciano').addEventListener('click', () => {
        ocultarImagenesKernel();
        imagenTamanoKernel.style.display = 'block';
        actualizarImagenTamanoKernel('laplaciano');
        aplicarFiltro('laplaciano');
    });
    document.getElementById('filtroSobel').addEventListener('click', () => {
        ocultarImagenesKernel();
        imagenTamanoKernel.style.display = 'block';
        actualizarImagenTamanoKernel('sobel');
        aplicarFiltro('sobel');
    });
    
    function ocultarImagenesKernel() {
        imagenKernelLaplaciano.style.display = 'none';
        imagenKernelSobel.style.display = 'none';
        imagenTamanoKernel.style.display = 'none';
        const contenedorExistente = document.querySelector('.sobel7x7-container');
        if (contenedorExistente) {
            contenedorExistente.remove();
        }
    }
    
    function actualizarImagenTamanoKernel(tipoFiltro) {
        const tamano = selectorTamanoKernel.value;
        if (tipoFiltro === 'sobel') {
            const contenedorExistente = document.querySelector('.sobel7x7-container');
            if (contenedorExistente) {
                contenedorExistente.remove();
            }
            if (tamano === '5') {
                imagenTamanoKernel.style.display = 'block';
                imagenTamanoKernel.src = 'images/sobel5x5.png';
            } else if (tamano === '7') {
                imagenTamanoKernel.style.display = 'none';
                const contenedorSobel7x7 = document.createElement('div');
                contenedorSobel7x7.style.display = 'flex';
                contenedorSobel7x7.style.gap = '20px';
                contenedorSobel7x7.style.justifyContent = 'center';
                
                const sobel7x7X = document.createElement('img');
                sobel7x7X.src = 'images/sobel7x7_x.png';
                sobel7x7X.style.maxWidth = '300px';
                
                const sobel7x7Y = document.createElement('img');
                sobel7x7Y.src = 'images/sobel7x7_y.png';
                sobel7x7Y.style.maxWidth = '300px';
                
                contenedorSobel7x7.className = 'sobel7x7-container';
                contenedorSobel7x7.appendChild(sobel7x7X);
                contenedorSobel7x7.appendChild(sobel7x7Y);
                document.querySelector('.filtros').appendChild(contenedorSobel7x7);
            } else {
                imagenTamanoKernel.style.display = 'block';
                imagenTamanoKernel.src = 'images/sobelKernel.png';
            }
        } else if (tipoFiltro === 'laplaciano') {
            if (tamano === '5') {
                imagenTamanoKernel.src = 'images/laplacian5x5.png';
            } else if (tamano === '7') {
                imagenTamanoKernel.src = 'images/laplacian7x7.png';
            } else {
                imagenTamanoKernel.src = 'images/laplacianKernel.png';
            }
            imagenTamanoKernel.style.display = 'block';
        } else {
            const contenedorExistente = document.querySelector('.sobel7x7-container');
            if (contenedorExistente) {
                contenedorExistente.remove();
            }
            imagenTamanoKernel.style.display = 'block';
            imagenTamanoKernel.src = `images/${tamano}x${tamano}kernel.png`;
        }
    }
    
    function manejarCambioTamanoKernel(tipoFiltro) {
        if (tipoFiltro === 'laplaciano') {
            selectorTamanoKernel.disabled = false;
            actualizarImagenTamanoKernel(tipoFiltro);
        } else if (tipoFiltro === 'sobel') {
            selectorTamanoKernel.disabled = false;
            actualizarImagenTamanoKernel(tipoFiltro);
        } else {
            selectorTamanoKernel.disabled = false;
            actualizarImagenTamanoKernel(tipoFiltro);
        }
    }
    
    selectorTamanoKernel.addEventListener('change', () => {
        const filtroActivo = document.querySelector('.filtros button.active')?.id.replace('filtro', '').toLowerCase();
        if (filtroActivo) {
            actualizarImagenTamanoKernel(filtroActivo);
        }
    });
    
    function cargarImagen(archivo) {
        if (!archivo || !archivo.type.startsWith('image/')) {
            alert('Por favor, selecciona un archivo de imagen válido.');
            return;
        }

        const lector = new FileReader();
        
        lector.onload = function(evento) {
            const img = new Image();
            img.onload = function() {
                const anchoMaximo = 500;
                const altoMaximo = 500;
                let ancho = img.width;
                let alto = img.height;
                
                if (ancho > anchoMaximo) {
                    alto = (anchoMaximo / ancho) * alto;
                    ancho = anchoMaximo;
                }
                
                if (alto > altoMaximo) {
                    ancho = (altoMaximo / alto) * ancho;
                    alto = altoMaximo;
                }
                
                lienzoOriginal.width = ancho;
                lienzoOriginal.height = alto;
                lienzoFiltrado.width = ancho;
                lienzoFiltrado.height = alto;
                
                contextoOriginal.drawImage(img, 0, 0, ancho, alto);
                contextoFiltrado.drawImage(img, 0, 0, ancho, alto);
                
                imagenOriginal = img;
                botonDescargar.disabled = false;
            };
            img.src = evento.target.result;
        };
        lector.readAsDataURL(archivo);
    }
    
    subidaImagen.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            cargarImagen(e.target.files[0]);
        }
    });
    
    botonReiniciar.addEventListener('click', function() {
        if (imagenOriginal) {
            contextoFiltrado.drawImage(imagenOriginal, 0, 0, lienzoOriginal.width, lienzoOriginal.height);
        }
    });
    
    botonDescargar.addEventListener('click', function() {
        if (!lienzoFiltrado) return;
        
        const enlace = document.createElement('a');
        enlace.download = 'imagen-filtrada.png';
        enlace.href = lienzoFiltrado.toDataURL('image/png');
        enlace.click();
    });
    
    function aplicarFiltro(tipoFiltro) {
        if (!imagenOriginal) return;
        
        const tamanoKernel = parseInt(selectorTamanoKernel.value);
        const datosImagen = contextoOriginal.getImageData(0, 0, lienzoOriginal.width, lienzoOriginal.height);
        const datosFiltrados = aplicarFiltroImagen(datosImagen, tipoFiltro, tamanoKernel);
        
        contextoFiltrado.putImageData(datosFiltrados, 0, 0);
    }
    
    function aplicarFiltroImagen(datosImagen, tipoFiltro, tamanoKernel = 3) {
        const ancho = datosImagen.width;
        const alto = datosImagen.height;
        const datos = datosImagen.data;
        const nuevosDatos = new ImageData(ancho, alto);
        const salida = nuevosDatos.data;
        
        const radioKernel = Math.floor(tamanoKernel / 2);
        
        for (let y = 0; y < alto; y++) {
            for (let x = 0; x < ancho; x++) {
                const posicionPixel = (y * ancho + x) * 4;
                
                if (tipoFiltro === 'mediana') {
                    aplicarFiltroMediana(x, y, ancho, alto, datos, salida, posicionPixel, radioKernel);
                } else if (tipoFiltro === 'media') {
                    aplicarFiltroMedia(x, y, ancho, alto, datos, salida, posicionPixel, radioKernel);
                } else if (tipoFiltro === 'laplaciano') {
                    aplicarFiltroLaplaciano(x, y, ancho, alto, datos, salida, posicionPixel);
                } else if (tipoFiltro === 'sobel') {
                    aplicarFiltroSobel(x, y, ancho, alto, datos, salida, posicionPixel);
                } else {
                    for (let i = 0; i < 4; i++) {
                        salida[posicionPixel + i] = datos[posicionPixel + i];
                    }
                }
            }
        }
        
        return nuevosDatos;
    }
    
    function aplicarFiltroMediana(x, y, ancho, alto, entrada, salida, posicionPixel, radioKernel) {
        const valores = new Array((2 * radioKernel + 1) * (2 * radioKernel + 1));
        const tamanoKernel = valores.length;
        
        function encontrarMediana(arr, len) {
            const medio = Math.floor(len / 2);
            let izquierda = 0;
            let derecha = len - 1;
            
            while (izquierda < derecha) {
                const pivote = arr[Math.floor((izquierda + derecha) / 2)];
                let i = izquierda - 1;
                let j = derecha + 1;
                
                while (true) {
                    do i++; while (arr[i] < pivote);
                    do j--; while (arr[j] > pivote);
                    if (i >= j) break;
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                }
                
                if (j < medio) izquierda = j + 1;
                else derecha = j;
            }
            
            return arr[medio];
        }
        
        let idx = 0;
        for (let ky = -radioKernel; ky <= radioKernel; ky++) {
            for (let kx = -radioKernel; kx <= radioKernel; kx++) {
                const px = Math.min(ancho - 1, Math.max(0, x + kx));
                const py = Math.min(alto - 1, Math.max(0, y + ky));
                const pos = (py * ancho + px) * 4;
                valores[idx++] = entrada[pos];
            }
        }
        salida[posicionPixel] = encontrarMediana(valores, tamanoKernel);
        
        idx = 0;
        for (let ky = -radioKernel; ky <= radioKernel; ky++) {
            for (let kx = -radioKernel; kx <= radioKernel; kx++) {
                const px = Math.min(ancho - 1, Math.max(0, x + kx));
                const py = Math.min(alto - 1, Math.max(0, y + ky));
                const pos = (py * ancho + px) * 4;
                valores[idx++] = entrada[pos + 1];
            }
        }
        salida[posicionPixel + 1] = encontrarMediana(valores, tamanoKernel);
        
        idx = 0;
        for (let ky = -radioKernel; ky <= radioKernel; ky++) {
            for (let kx = -radioKernel; kx <= radioKernel; kx++) {
                const px = Math.min(ancho - 1, Math.max(0, x + kx));
                const py = Math.min(alto - 1, Math.max(0, y + ky));
                const pos = (py * ancho + px) * 4;
                valores[idx++] = entrada[pos + 2];
            }
        }
        salida[posicionPixel + 2] = encontrarMediana(valores, tamanoKernel);
        
        salida[posicionPixel + 3] = 255;
    }
    
    function aplicarFiltroMedia(x, y, ancho, alto, entrada, salida, posicionPixel, radioKernel) {
        let sumaRojo = 0, sumaVerde = 0, sumaAzul = 0;
        let contador = 0;
        
        for (let ky = -radioKernel; ky <= radioKernel; ky++) {
            for (let kx = -radioKernel; kx <= radioKernel; kx++) {
                const px = Math.min(ancho - 1, Math.max(0, x + kx));
                const py = Math.min(alto - 1, Math.max(0, y + ky));
                const pos = (py * ancho + px) * 4;
                
                sumaRojo += entrada[pos];
                sumaVerde += entrada[pos + 1];
                sumaAzul += entrada[pos + 2];
                contador++;
            }
        }
        
        salida[posicionPixel] = sumaRojo / contador;
        salida[posicionPixel + 1] = sumaVerde / contador;
        salida[posicionPixel + 2] = sumaAzul / contador;
        salida[posicionPixel + 3] = 255;
    }
    
    function aplicarFiltroLaplaciano(x, y, ancho, alto, entrada, salida, posicionPixel) {
        if (x === 0 || y === 0 || x === ancho - 1 || y === alto - 1) {
            for (let i = 0; i < 4; i++) {
                salida[posicionPixel + i] = entrada[posicionPixel + i];
            }
            return;
        }
        
        const kernel = [
            [0, -1, 0],
            [-1, 4, -1],
            [0, -1, 0]
        ];
        
        let rojo = 0, verde = 0, azul = 0;
        
        for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
                const pos = ((y + ky) * ancho + (x + kx)) * 4;
                const peso = kernel[ky + 1][kx + 1];
                
                rojo += entrada[pos] * peso;
                verde += entrada[pos + 1] * peso;
                azul += entrada[pos + 2] * peso;
            }
        }
        
        const normalizar = (val) => {
            return Math.min(255, Math.max(0, val + 128));
        };
        
        salida[posicionPixel] = normalizar(rojo);
        salida[posicionPixel + 1] = normalizar(verde);
        salida[posicionPixel + 2] = normalizar(azul);
        salida[posicionPixel + 3] = 255;
    }
    
    function aplicarFiltroSobel(x, y, ancho, alto, entrada, salida, posicionPixel) {
        if (x === 0 || y === 0 || x === ancho - 1 || y === alto - 1) {
            for (let i = 0; i < 4; i++) {
                salida[posicionPixel + i] = entrada[posicionPixel + i];
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
                const pos = ((y + ky) * ancho + (x + kx)) * 4;
                const gris = (entrada[pos] + entrada[pos + 1] + entrada[pos + 2]) / 3;
                
                gx += gris * kernelX[ky + 1][kx + 1];
                gy += gris * kernelY[ky + 1][kx + 1];
            }
        }
        
        const magnitud = Math.sqrt(gx * gx + gy * gy);
        const magnitudNormalizada = Math.min(255, Math.max(0, magnitud * 4));
        
        salida[posicionPixel] = magnitudNormalizada;
        salida[posicionPixel + 1] = magnitudNormalizada;
        salida[posicionPixel + 2] = magnitudNormalizada;
        salida[posicionPixel + 3] = 255;
    }
    
    document.querySelectorAll('.filtros button').forEach(boton => {
        boton.addEventListener('click', function() {
            document.querySelectorAll('.filtros button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const tipoFiltro = this.id.replace('filtro', '').toLowerCase();
            manejarCambioTamanoKernel(tipoFiltro);
        });
    });
});