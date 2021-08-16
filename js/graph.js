export class Graph {
    constructor() {
        this.canvas = document.getElementById("graph");

        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        this.ctx = this.canvas.getContext("2d");

        this.padding = 50;

        this.xAxisData = null;
        this.data = null;

        window.onresize = () => {
            if(this.data != null && this.data != null) {
                this.canvas.width = this.canvas.clientWidth;
                this.canvas.height = this.canvas.clientHeight;

                this.renderData(this.xAxisData, this.data);
            }
        }
    }

    drawBackground() {
        // NOTE: make sure this doesn't cause memory leak
        this.ctx.fillStyle = "gray";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderData = (xAxisData, data) => {

        this.xAxisData = xAxisData;
        this.data = data;

        // clear data
        this.drawBackground();

        // temporary padding background
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(this.padding, this.padding, this.canvas.width - this.padding * 2, this.canvas.height - this.padding * 2);

        // constructX axis
        let stepX = (this.canvas.width - this.padding) / (xAxisData.length - 1);
        // constructY axis
        
        // find highest value
        // NOTE: implement search algorithm
        let max = 3;
        // let min = 0.5;
        // let stepY = this.canvas.height / ((max - min) / 2); 
        // console.log(stepY);

        // draw grid
        this.drawGrid(stepX, xAxisData.length, this.padding);
        // draw labels

        // set points


        // draw lines
        this.drawLines(stepX, xAxisData.length, data, max, this.padding);
    }

    drawLines(stepX, countX, data, max, padding)
    {
        this.ctx.beginPath();

        stepX -= padding;

        for(let x = 1; x < countX; x++) {

            this.ctx.moveTo(parseInt((x - 1) * stepX) + padding, this.canvas.height - data[x - 1] * ((this.canvas.height - padding) / max));
            this.ctx.lineTo(parseInt(x * stepX) + padding, this.canvas.height - data[x] * ((this.canvas.height - padding) / max));
            console.log(data[x-1]);
            console.log(data[x]);
            console.log("next");
            // console.log("hello");
            // console.log(parseInt(x * stepX), " ", data[x - 1]);
            // console.log(parseInt(x * stepX), " ", data[x])
        }

        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "red";
        this.ctx.stroke();
    }

    drawGrid(stepX, countX, padding) {

        this.ctx.beginPath();
        
        stepX -= padding;

        for(let x = 0; x < countX + 1; x++) {
            this.ctx.moveTo(parseInt(x * stepX + padding), padding);
            this.ctx.lineTo(parseInt(x * stepX + padding), this.canvas.height - padding);
        }

        // for(let y = 0; y < stepY; y++) {
        //     this.ctx.moveTo(0, y * stepY);
        //     this.ctx.lineTo(this.canvas.width, y * stepY);
        // }

        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "green";
        this.ctx.stroke();

        // this.ctx.moveTo(20, 0);
        // this.ctx.lineTo(20, this.canvas.clientHeight);
        // this.ctx.stroke();
    }
}