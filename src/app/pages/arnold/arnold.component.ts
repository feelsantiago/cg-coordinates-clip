import { Component, ViewChild } from '@angular/core';
import { CanvasComponent } from '../../components/canvas/canvas.component';

export type FilesEvent = { [key: number]: File };

@Component({
    selector: 'app-arnold',
    templateUrl: 'arnold.component.html',
    styleUrls: ['arnold.component.scss'],
})
export class ArnoldComponent {
    @ViewChild(CanvasComponent)
    public canvas: CanvasComponent;

    public hasImage = false;

    public imageWidth = 100;

    public imageHeight = 100;

    public iteration = 0;

    public originalDataImage: Uint8ClampedArray;

    public isProcessingAutoIteration = false;

    public onFileUpload(files: FilesEvent): void {
        const image = files[0];

        const imageName = image.name;
        const isGood = /\.(?=gif|jpg|png|jpeg)/gi.test(imageName);

        if (isGood) {
            this.hasImage = true;
            const img = new Image();
            img.style.maxWidth = '60%';

            img.addEventListener('load', () => {
                this.imageWidth = img.width;
                this.imageHeight = img.height;

                setTimeout(() => {
                    this.canvas.drawImage(img);
                    this.originalDataImage = this.canvas.getImageData().data;
                }, 400);
            });

            img.src = URL.createObjectURL(image);
        }
    }

    public onNextIteration(): void {
        const imgNext = this.calculateIteration();
        this.iteration++;
        this.canvas.putImageDate(imgNext);
    }

    public onPreviousIteration(): void {
        const imgNext = this.calculateIteration(true);
        this.iteration--;
        this.canvas.putImageDate(imgNext);
    }

    private calculateIteration(isPrevious = false): ImageData {
        const imgData = this.canvas.getImageData();
        const imgNext = this.canvas.getImageData();

        const { data } = imgData;
        const nextData = imgNext.data;
        let source = 0;
        const dataWidth = Math.sqrt(data.length >> 2);
        for (let y = 0; y < dataWidth; y++) {
            for (let x = 0; x < dataWidth; x++) {
                const xNew = (2 * x + y) % dataWidth;
                const yNew = (x + y) % dataWidth;
                let destination = (yNew * dataWidth + xNew) * 4;
                for (let j = 0; j < 4; j++) {
                    if (isPrevious) {
                        nextData[source++] = data[destination++];
                    } else {
                        nextData[destination++] = data[source++];
                    }
                }
            }
        }

        return imgNext;
    }
}
