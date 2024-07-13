const img = document.querySelector("#img");
const scene = document.querySelector("#scene");
const fontColor = document.querySelector("#fontColor");
const fontSize = document.querySelector("#fontSize");
const customImg = document.querySelector("#customImg");
const textsEle = document.querySelector("#texts");
const lineHeight = document.querySelector("#lineHeight");

let fontColorVal = "#000";
let fontSizeVal = 150;
let textPaddingBottom = 80;

let texts = ["是的，那些话", "的确都是我周树人说的"];

textsEle.value = texts.join("\n");
fontSize.value = fontSizeVal;
fontColor.defaultValue = fontColorVal;
lineHeight.value = textPaddingBottom;
fontSize.setAttribute("data-size", fontSize.value);
lineHeight.setAttribute("data-size", lineHeight.value);
const updateTexts = () => {
    texts = textsEle.value.split("\n").filter((v) => v);
};
const updateFontSizeVal = () => {
    fontSizeVal = fontSize.value;
    fontSize.setAttribute("data-size", fontSize.value);
};

const updateTextPaddingBottom = () => {
    textPaddingBottom = Number(lineHeight.value);
    lineHeight.setAttribute("data-size", lineHeight.value);
};

const updateFontColor = () => {
    fontColorVal = fontColor.value;
};

customImg.addEventListener("input", () => {
    const file = customImg.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;
            img.onload = () => {
                render();
            };
        };
        reader.readAsDataURL(file);
    }
});
fontSize.addEventListener("input", () => {
    beforeRender();
    render();
});
textsEle.addEventListener("input", () => {
    beforeRender();
    render();
});
lineHeight.addEventListener("input", () => {
    beforeRender();
    render();
});
fontColor.addEventListener("input", () => {
    beforeRender();
    render();
});

function beforeRender() {
    updateTextPaddingBottom();
    updateFontSizeVal();
    updateFontColor();
    updateTexts();
}

function setFontCtx(ctx) {
    ctx.font = `${fontSizeVal}px PRSXT`;
    ctx.fillStyle = fontColorVal;
    ctx.textAlign = "center";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
}

function renderFullImage(text) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    scene.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const textWidth = canvas.width / 2;
    const textHeight = img.height - textPaddingBottom;
    setFontCtx(ctx);
    text && ctx.fillText(text, textWidth, textHeight);
}

function render() {
    scene.innerHTML = "";
    const first = texts.shift();
    renderFullImage(first);
    renderRestTexts(texts);
}

function renderRestTexts(texts) {
    texts.forEach((text, index) => {
        const canvas = document.createElement("canvas");
        const canvasHeight = fontSizeVal * 1.4;

        canvas.width = img.width;
        canvas.height = canvasHeight;

        scene.appendChild(canvas);

        const ctx = canvas.getContext("2d");

        // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        const startY = img.height - canvasHeight;
        ctx.drawImage(
            img,
            0,
            startY,
            img.width,
            canvasHeight,
            0,
            0,
            img.width,
            canvasHeight,
        );

        setFontCtx(ctx);
        const textWidth = canvas.width / 2;
        const textHeight = canvasHeight - textPaddingBottom;
        ctx.fillText(text, textWidth, textHeight);
    });
}

document.querySelector("#download").addEventListener("click", () => {
    html2canvas(scene).then(function (canvas) {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "screenshot.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});

setTimeout(render, 1500);
