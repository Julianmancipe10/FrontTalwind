import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const srcDir = './src/assets/images';
const outputDir = './src/assets/images/optimized';

// Crear el directorio de salida si no existe
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Configuración de optimización
const config = {
    jpeg: {
        quality: 75,
        mozjpeg: true,
    },
    png: {
        quality: 75,
        compressionLevel: 9,
    },
};

// Procesar todas las imágenes
async function optimizeImages() {
    const files = fs.readdirSync(srcDir);
    
    for (const file of files) {
        if (!['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase())) continue;
        if (file.includes('optimized')) continue; // Saltar archivos ya optimizados
        
        const inputPath = path.join(srcDir, file);
        const outputPath = path.join(outputDir, `optimized_${file}`);
        
        try {
            const image = sharp(inputPath);
            const metadata = await image.metadata();
            
            // Redimensionar si la imagen es muy grande
            if (metadata.width > 1920) {
                image.resize(1920, null, {
                    withoutEnlargement: true,
                    fit: 'inside'
                });
            }
            
            // Optimizar según el formato
            if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
                await image
                    .jpeg(config.jpeg)
                    .toFile(outputPath);
            } else if (metadata.format === 'png') {
                await image
                    .png(config.png)
                    .toFile(outputPath);
            }
            
            const stats = fs.statSync(inputPath);
            const optimizedStats = fs.statSync(outputPath);
            const savings = ((stats.size - optimizedStats.size) / stats.size * 100).toFixed(2);
            
            console.log(`✓ ${file}: Reducido ${savings}% (${(stats.size / 1024 / 1024).toFixed(2)}MB → ${(optimizedStats.size / 1024 / 1024).toFixed(2)}MB)`);
        } catch (error) {
            console.error(`✗ Error procesando ${file}:`, error.message);
        }
    }
}

optimizeImages().catch(console.error); 