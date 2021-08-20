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
        this.tempStep = 0;

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
            let dataIndex = Math.round(x / this.tempStep);
    
            if(dataIndex >= 0 && dataIndex < this.data.length) {
    
                this.drawClient(this.data, this.labels);
                this.drawLine(
                    dataIndex * this.tempStep + this.padding,
                    this.padding, dataIndex * this.tempStep + this.padding,
                    this.canvas.height - this.padding,
                    "black");

                this.drawBox(dataIndex * this.tempStep + this.padding,
                    0, 100, 50, this.data[dataIndex], "orange");
            }
        }
    }

    drawBox(x, y, width, height, text, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x - width / 2, y, width, height);
        this.ctx.fillStyle = "white";
        this.ctx.fillText(text, x, height - y);
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
        this.fillRect({ x: 0, y: 0, w: this.canvas.width, h: this.canvas.height }, "gray");

        // apply padding to all values
        let startX = this.padding;
        let startY = this.padding;
        let graphWidth = this.canvas.width - this.padding * 2;
        let graphHeight = this.canvas.height - this.padding * 2;
        let stepX = Math.round(graphWidth / (labels.length - 1));
        let stepY = graphHeight / 4;
        this.tempStep = stepX;
        
        // can't be less than one pixel
        if(stepX < 1) {
            stepX = 1;
        }

        let maxY = Math.max(...this.data);
        let minY = Math.min(...this.data);

        let diff = maxY - minY;

        maxY -= minY;

        
        // draw graph backgroud
        this.fillRect({ x: startX, y: startY, w: graphWidth, h: graphHeight }, "white");

        this.drawGrid(startX, startY, graphWidth, graphHeight, stepX, stepY, labels.length - 1);
        this.drawLabels(labels, startX, stepX, stepY, minY, diff, graphHeight);
        this.drawGraph(data, startX, startY, maxY, minY, labels.length, stepX, graphHeight);
    }

    drawLabels(labels, startX, stepX, stepY, minY, diff, graphHeight, color = "white") {

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

    drawGrid(x, y, width, height, stepX, stepY, count, color = "green") {
        
        this.ctx.beginPath();

        let startX = x;

        for(let i = 0; i < count + 1; i++) {
            // this.ctx.moveTo(startX, y);
            // this.ctx.lineTo(startX, height + this.padding);

            startX += stepX;
        }

        let startY = this.padding;

        for(let i = 0; i < count + 1; i++) {

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