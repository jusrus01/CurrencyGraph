export class Graph {
    constructor() {
        this.canvas = document.getElementById("graph");

        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        this.rect = this.canvas.getBoundingClientRect();

        this.ctx = this.canvas.getContext("2d");

        this.padding = 50;

        this.labels = null;
        this.data = null;
        this.stepX = 0;

        this.showExtraData = false;

        window.onresize = () => {
            if(this.data != null && this.labels != null) {
                this.canvas.width = this.canvas.clientWidth;
                this.canvas.height = this.canvas.clientHeight;
                this.rect = this.canvas.getBoundingClientRect();

                this.drawClient(this.data, this.labels);
            }
        }

        this.canvas.addEventListener("mouseenter", () => { this.showExtraData = true; });

        this.canvas.addEventListener("mouseleave", () => { 
            this.showExtraData = false;
            this.drawClient(this.data, this.labels);
        });

        this.canvas.addEventListener("mousemove", (e) => this.showData(e));
    }

    showData(e) {

        if(this.showExtraData) {

            let x = e.clientX - this.padding - this.rect.left;
            let dataIndex = Math.round(x / this.stepX);

            let y = this.canvas.height - this.padding;
    
            if(dataIndex >= 0 && dataIndex < this.data.length) {
    
                this.drawClient(this.data, this.labels);

                let x = dataIndex * this.stepX + this.padding;

                this.drawLine(x, this.padding, x, y, "black");
                this.drawBox(x, 0, 100, 50, this.data[dataIndex], this.labels[dataIndex], "white");
            }
        }
    }

    drawBox(x, y, width, height, text, dateText, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x - width / 2, y, width, height);
        this.ctx.fillStyle = "black";
        this.ctx.fillText(text, x, height - 30);
        this.ctx.fillText(dateText, x, height - 10);
    }

    drawLine(x1, y1, x2, y2, color) {
        this.ctx.beginPath();

        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);

        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }

    fillRect(rect, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    }

    drawClient(data, labels) {
        // save given values
        // because on screen resize
        // we will use them to redraw entire client
        this.data = data;
        this.labels = labels;

        // draw background
        this.fillRect({ x: 0, y: 0, w: this.canvas.width, h: this.canvas.height }, "white");

        // apply padding to all values
        let startX = this.padding;
        let startY = this.padding;
        let graphWidth = this.canvas.width - this.padding * 2;
        let graphHeight = this.canvas.height - this.padding * 2;
        this.stepX = Math.round(graphWidth / (labels.length - 1));
        let stepY = graphHeight / 4;
        
        // can't be less than one pixel
        if(this.stepX < 1) {
            this.stepX = 1;
        }

        let maxY = Math.max(...this.data);
        let minY = Math.min(...this.data);

        let diff = maxY - minY;

        maxY -= minY;

        
        // draw graph backgroud
        this.fillRect({ x: startX, y: startY, w: graphWidth, h: graphHeight }, "white");

        this.drawGrid(startX, startY, graphWidth, graphHeight, this.stepX, stepY, labels.length - 1);
        this.drawLabels(labels, startX, this.stepX, stepY, minY, diff, graphHeight);
        this.drawGraph(data, startX, startY, maxY, minY, labels.length, this.stepX, graphHeight);
    }

    drawLabels(labels, startX, stepX, stepY, minY, diff, graphHeight, color = "black") {

        let step = Math.round(labels.length / 6);
        this.ctx.fillStyle = color;
        this.ctx.font = "12px serif";

        let metrics;
        let x = startX;

        for(let i = 0; i < labels.length; i++) {

            if((i !== 0 && i % step == 0) || i == 0) {
                metrics = this.ctx.measureText(labels[i]);
                this.ctx.fillText(labels[i], startX - metrics.width / 2, this.canvas.height);
            }

            startX += stepX;
        }

        let startY = this.padding + graphHeight;
        let add = 0;

        for(let i = 0; i < 5; i++) {

            this.ctx.fillText((minY + add).toFixed(2), 0, startY + 6);
 
            add = (i + 2) * diff / 5;

            startY -= stepY;
        }
    }

    drawGrid(x, y, width, height, stepX, stepY, count, color = "gray") {
        
        this.ctx.beginPath();

        let startX = x;

        for(let i = 0; i < count + 1; i++) {
            // this.ctx.moveTo(startX, y);
            // this.ctx.lineTo(startX, height + this.padding);

            startX += stepX;
        }

        let startY = this.padding;

        for(let i = 0; i < 5; i++) {

            this.ctx.moveTo(x, startY);
            this.ctx.lineTo(width + this.padding, startY);

            startY += stepY;
        }

        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }

    drawGraph(data, startX, startY, maxY, minY, count, stepX, height, color = "blue") {
        
        this.ctx.beginPath();

        for(let i = 1; i < count; i++) {

            let y1 = height - Math.round((this.data[i - 1] - minY) * height / maxY) + this.padding;
            let y2 = height - Math.round((this.data[i] - minY) * height / maxY) + this.padding;

            this.ctx.moveTo(startX, y1);
            this.ctx.lineTo(startX + stepX, y2);

            startX += stepX;
        }

        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }
}