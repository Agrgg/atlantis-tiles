const r = 40;
const a = 2 * Math.PI / 6;
const strokeWidth = 1;
const startPoint = [195, 100];

const originalTiles = Array(16).fill(1)
    .concat(Array(16).fill(2))
    .concat(Array(8).fill(3));
let tileIndex = 0;
let tiles = null;

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    
    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
    
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    
    return array;
}

function drawHexagon(ctx, x, y) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        ctx.lineTo(x + r * Math.sin(a * i), y + r * Math.cos(a * i));
    }
    ctx.closePath();
    ctx.stroke();
    let style = tiles[tileIndex++];
    if (style) {
        ctx.fillStyle = style > 2
            ? 'gray'
            : style > 1
                ? 'green'
                : 'yellow';
        ctx.fill();
    }
    
}

function goToNextRow(x, y, horizontalOffset) {
    return [
        x + horizontalOffset * Math.cos(Math.PI / 6) * r,
        y + r + r / 2
    ];
}

function drawRow(ctx, hexagonCount, x, y) {
    for (let i = 0; i < hexagonCount; i++) {
        drawHexagon(ctx, x + 2 * Math.cos(Math.PI / 6) * r * i + strokeWidth, y);
    }
}

function drawField(context) {
    let rows = [
        [ 5, -1 ],
        [ 8, -3 ],
        [ 7, +1 ],
        [ 8, -1 ],
        [ 5, +3 ],
        [ 4, +1 ]
    ];

    drawRow(context, 4, ...startPoint);
    let nextStartPoint = startPoint;
    for (const rowData of rows) {
        nextStartPoint = goToNextRow(...nextStartPoint, rowData[1]);
        drawRow(context, rowData[0], ...nextStartPoint);
    }
}

function shuffleTiles() {
    tileIndex = 0;
    tiles = shuffle([...originalTiles]);
    tiles.splice(20, 0, 0);
}

window.onload = function() {
    let canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    shuffleTiles();
    drawField(context);

    canvas.onclick = () => {
        context.reset();
        shuffleTiles();
        drawField(context);
    };
};