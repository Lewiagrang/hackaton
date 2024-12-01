import fs from 'fs';
import { createCanvas } from 'canvas';
import bwipjs from 'bwip-js';

// Преобразование входного массива в формат для SVG
export function transformDataToSVGElements(data) {
    console.log(data);
    
    const svgElements = [];
    const svgDimensions = data[0]; // Первый массив с размерами SVG
    const svgWidth = parseInt(svgDimensions[1]);
    const svgHeight = parseInt(svgDimensions[2]);

    // Добавляем вертикальный штрих-код
    const verticalBarcode = data[1];
    svgElements.push({
        type: 'barcode',
        content: verticalBarcode[1],
        orientation: 'vertical',
        width: svgHeight * 0.55, // Ширина вертикального штрих-кода
        height: svgWidth * 0.1, // Высота вертикального штрих-кода
        alignment: verticalBarcode[2], // Выравнивание
        scale: 9,
    });

    // Обрабатываем остальные элементы
    for (let i = 2; i < data.length - 1; i++) {
        const item = data[i];
        svgElements.push({
            type: 'text',
            name: item[0],
            content: item[1],
            size: parseInt(item[2]), // Размер шрифта
            font: item[3] // Шрифт
        });
    }

    // Добавляем горизонтальный штрих-код
    const horizontalBarcode = data[data.length - 1];
    svgElements.push({
        type: 'barcode',
        content: horizontalBarcode[1],
        orientation: 'horizontal',
        width: 50, // Ширина горизонтального штрих-кода
        height: 50, // Высота горизонтального штрих-кода
    });

    return {
        svgWidth,
        svgHeight,
        elements: svgElements
    };
}

export async function createSVG(elements, svgWidth, svgHeight) {
    const width = svgWidth;
    const height = svgHeight;
    const lineHeight = 1;
    const padding = 2;
    const canvasPadding = 20;
    const barcodePadding = 1;
    let currentY = canvasPadding;

    // Функция для получения ширины и высоты текста
    function getTextDimensions(text, font, fontSize) {
        const canvas = createCanvas(500, 500);
        const context = canvas.getContext('2d');
        context.font = `${fontSize}px ${font}`;
        
        const metrics = context.measureText(text);
        const width = metrics.width;
        const height = fontSize;
        
        return { width, height };
    }

    const svgParts = [];
    
    // Начинаем SVG
    svgParts.push(`<svg id="modelSVG" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}">`);
    svgParts.push(`<rect width="100%" height="100%" fill="white" /><rect x="5" y="5" width="${width - 10}" height="${height - 10}" fill="none" stroke="black" stroke-width="2" />`);


    let modelAndName = canvasPadding+svgHeight/20+padding
    let priceInRubles = canvasPadding+svgHeight/20+svgHeight/6+padding*2
    let price = canvasPadding+svgHeight/20+svgHeight/6+svgHeight/20+padding*3
    let bigData = canvasPadding+svgHeight/20+svgHeight/6+svgHeight/20+svgHeight/6+padding*4        
    let sizes = svgHeight-svgHeight/7


    for (const element of elements) {
        if (element.type === 'text') {
            const name = element.name
            const text = element.content;
            const font = element.font || 'Arial';
            const fontSize = element.size || 16;
            // Split the text into blocks based on a delimiter (e.g., "|")
            const textBlocks = text.split('|'); // Use | as a delimiter for blocks
                    

            if(name == "number"){
                for (const block of textBlocks) {
                    const words = block.trim().split(' ');
                    let line = '';
    
                    for (const word of words) {
                        const testLine = line + word + ' ';
                        const { width: textWidth } = getTextDimensions(testLine, font, fontSize);
    
                        if (textWidth > width/4) {
                            svgParts.push(`<text x="${canvasPadding}" y="${canvasPadding}" font-family="${font}" font-size="${fontSize}">${line.trim()}</text>`);
                            currentY += fontSize + lineHeight;
                            line = word + ' ';
                        } else {
                            line = testLine;
                        }
                    }
                    if (line) {
                        svgParts.push(`<text x="${canvasPadding}" y="${currentY}" font-family="${font}" font-size="${fontSize}">${line.trim()}</text>`);
                        currentY += fontSize + padding;
                    }
    
                    // Add some space between blocks
                    currentY += 10; // Adjust this value for spacing between blocks
                }
                // if (currentY > svgHeight/20+canvasPadding) {
                //     return 'Ошибка: Текст и/или штрих-коды выходят за рамки.';
                // }
            }
            

            

            if(name == "models" || name == "name"){
                for (const block of textBlocks) {
                    const words = block.trim().split(' ');
                    let line = '';
    
                    for (const word of words) {
                        const testLine = line + word + ' ';
                        const { width: textWidth } = getTextDimensions(testLine, font, fontSize);
                        if (textWidth > width - canvasPadding - 50) {
                            modelAndName += fontSize + lineHeight;
                            svgParts.push(`<text x="${canvasPadding}" y="${modelAndName}" font-family="${font}" font-size="${fontSize}">${line.trim()}</text>`);
                            line = word + ' ';
                        } else {
                            line = testLine;
                        }
                    }
                    if (line) {
                        modelAndName += fontSize + padding;
                        svgParts.push(`<text x="${canvasPadding}" y="${modelAndName}" font-family="${font}" font-size="${fontSize}">${line.trim()}</text>`);
                    }
    
                    // Add some space between blocks

                    // if (currentY > canvasPadding+fontSize+svgHeight/20+svgHeight/4+padding) {
                    //     return 'Ошибка: Текст и/или штрих-коды выходят за рамки.';
                    // }
                }
                // modelAndName += fontSize + lineHeight;
            }

            
            if(name == "price-in-rubles"){
                for (const block of textBlocks) {
                    const words = block.trim().split(' ');
                    let line = '';
    
                    for (const word of words) {
                        const testLine = line + word + ' ';
                        const { width: textWidth } = getTextDimensions(testLine, font, fontSize);
                        if (textWidth > width - canvasPadding - 50) {
                            priceInRubles += fontSize + lineHeight;
                            svgParts.push(`<text x="${canvasPadding}" y="${priceInRubles}" font-family="${font}" font-size="${fontSize}">${line.trim()}</text>`);
                            line = word + ' ';
                        } else {
                            line = testLine;
                        }
                    }
                    if (line) {
                        priceInRubles += fontSize + padding;
                        svgParts.push(`<text x="${canvasPadding}" y="${priceInRubles}" font-family="${font}" font-size="${fontSize}">${line.trim()}</text>`);
                    }
    
                    // Add some space between blocks

                    // if (currentY > canvasPadding+fontSize+svgHeight/20+svgHeight/4+padding) {
                    //     return 'Ошибка: Текст и/или штрих-коды выходят за рамки.';
                    // }
                }
                priceInRubles += fontSize + lineHeight;
            }


            if(name == "price"){
                for (const block of textBlocks) {
                    const words = block.trim().split(' ');
                    let line = '';
    
                    for (const word of words) {
                        const testLine = line + word + ' ';
                        const { width: textWidth } = getTextDimensions(testLine, font, fontSize);
                        if (textWidth > width - canvasPadding - 50) {
                            price += fontSize + lineHeight;
                            svgParts.push(`<text x="${canvasPadding}" y="${price}" font-family="${font}" font-size="${fontSize}">${line.trim()}</text>`);
                            line = word + ' ';
                        } else {
                            line = testLine;
                        }
                    }
                    if (line) {
                        price += fontSize + padding;
                        svgParts.push(`<text x="${canvasPadding}" y="${price}" font-family="${font}" font-size="${fontSize}">${line.trim()}</text>`);
                    }
    
                    // Add some space between blocks

                    // if (currentY > canvasPadding+fontSize+svgHeight/20+svgHeight/4+padding) {
                    //     return 'Ошибка: Текст и/или штрих-коды выходят за рамки.';
                    // }
                }
                price += fontSize + lineHeight;
            }


            if(name == "composition" || name == "mrt-country" || name == "date-of-manufacture" || name == "importer" || name == "mrt" || name == "producer" || name == "producer-address"){
                for (const block of textBlocks) {
                    const words = block.trim().split(' ');
                    let line = '';
    
                    for (const word of words) {
                        const testLine = line + word + ' ';
                        const { width: textWidth } = getTextDimensions(testLine, font, fontSize);
                        if (textWidth > width - canvasPadding - 50) {
                            bigData += fontSize + lineHeight;
                            svgParts.push(`<text x="${canvasPadding}" y="${bigData}" font-family="${font}" font-size="${fontSize}">${line.trim()}</text>`);
                            line = word + ' ';
                        } else {
                            line = testLine;
                        }
                    }
                    if (line) {
                        bigData += fontSize + padding;
                        svgParts.push(`<text x="${canvasPadding}" y="${bigData}" font-family="${font}" font-size="${fontSize}">${line.trim()}</text>`);
                    }
    
                    // Add some space between blocks

                    // if (currentY > canvasPadding+fontSize+svgHeight/20+svgHeight/4+padding) {
                    //     return 'Ошибка: Текст и/или штрих-коды выходят за рамки.';
                    // }
                }
                // bigData += fontSize + lineHeight;
            } 

            if(name == "ru-size" || name == "mrt-size" ){
                for (const block of textBlocks) {
                    const words = block.trim().split(' ');
                    let line = ''; 
    
                    for (const word of words) {
                        const testLine = line + word + ' ';
                        const { width: textWidth } = getTextDimensions(testLine, font, fontSize);
                        if (textWidth > width - canvasPadding - 50) {
                            sizes += fontSize + lineHeight;
                            svgParts.push(`<text x="${canvasPadding}" y="${sizes}" font-family="${font}" font-size="${fontSize}">${line.trim()}</text>`);
                            line = word + ' ';
                        } else {
                            line = testLine;
                        }
                    }
                    if (line) {
                        sizes += fontSize + padding;
                        svgParts.push(`<text x="${canvasPadding}" y="${sizes}" font-family="${font}" font-size="${fontSize}">${line.trim()}</text>`);
                    }
    
                    // Add some space between blocks

                    // if (currentY > canvasPadding+fontSize+svgHeight/20+svgHeight/4+padding) {
                    //     return 'Ошибка: Текст и/или штрих-коды выходят за рамки.';
                    // }
                }
                sizes += fontSize + lineHeight;
            }



            
        } else if (element.type === 'barcode') {
            const barcodeData = element.content;
            const orientation = element.orientation || 'horizontal';
            const barcodeWidth = element.height || 200;
            const barcodeHeight = element.width || 50;
            const alignment = element.alignment || 'left';
            const barcodeScale = element.scale || 10; // Новый параметр для выравнивания

            // Генерируем штрих-код
            const barcodeBuffer = await bwipjs.toBuffer({
                bcid: 'code128',
                text: barcodeData,
                scale: barcodeScale,
                height: orientation === 'vertical' ? barcodeWidth : barcodeHeight, // Высота для вертикального штрих-кода
                includetext: false,
                textxalign: 'center',
                width: orientation === 'vertical' ? barcodeHeight : barcodeWidth, // Ширина для вертикального штрих-кода
            });
            
            

            const barcodeBase64 = barcodeBuffer.toString('base64');

            // Добавляем штрих-код в SVG
            if (orientation === 'vertical') {   
                let xPosition;
                if (alignment === 'right') {
                    xPosition = width - canvasPadding - barcodeWidth; // Прижимается к правому краю
                } else {
                    xPosition = canvasPadding + (barcodeHeight - barcodeWidth) / 2; // По центру
                }

                svgParts.push(`<image x=${svgWidth+30} y="${currentY}" width="${barcodeHeight}" height="${barcodeWidth}" transform="rotate(90, ${svgWidth+10}, 0)" xlink:href="data:image/png;base64,${barcodeBase64}" />`);
            } else {
                svgParts.push(`<image x="${canvasPadding}" y="${svgHeight-50}" width="${barcodeHeight}" height="${barcodeWidth}" xlink:href="data:image/png;base64,${barcodeBase64}" />`);
            }
        }
    }

    if (currentY > height - canvasPadding) {
        return 'Ошибка: Текст и/или штрих-коды выходят за рамки канваса.';
    }

    svgParts.push('</svg>');

    const svgString = svgParts.join('');

    // fs.writeFileSync('output.svg', svgString);
    // console.log('SVG изображение сохранено как output.svg');

    return svgString;
}

