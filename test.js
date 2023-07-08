const jsonFilePath = "./sample_json_from_farbicjs.json";
let jsonObject;
let canvas;
let popover;

function drawFunction() {
    const { width, height } = jsonObject.objects[0];
    
    canvas.setDimensions({ width, height }); 

    canvas.getObjects().forEach(function (obj) {
        obj.selectable = false;
        obj.interactive = false;
    });

    canvas.calcOffset();
    canvas.renderAll();

    canvas.on("mouse:move", function (options) {
        var p = canvas.getPointer(options.e);
        const mouseX = p.x;
        const mouseY = p.y;

        canvas.forEachObject(function (obj) {
            if (obj.id != "workspace" && obj.type != "image") {
                const isHovering = mouseX >= obj.left && mouseX <= obj.left + obj.width && mouseY >= obj.top && mouseY <= obj.top + obj.height;
                if (isHovering) {
                    showPopover(obj);
                    obj.set("opacity", 0.9);
                } else {
                    obj.set("opacity", 0.7);
                    hidePopover();
                }
            }
        });
        
        canvas.calcOffset();
        canvas.renderAll();
    });
}

function showPopover(object) {
    console.log("showing popver");
    popover.innerHTML = "Hello"; //square.popoverText;
    popover.style.display = "block";
    popover.style.left = `${canvas._offset.left + object.left + object.width + 10}px`; // Use template literals for concatenation
    popover.style.top = `${canvas._offset.top + object.top + object.height / 2}px`; // Use template literals for concatenation
    popover.style.transform = `translateY(-50%)`;
  }

function hidePopover() {
    popover.style.display = "none";
}

function reviver(o, object) {
    fabric.log(o, object);
}

function draw() {
    canvas.loadFromJSON(jsonObject, drawFunction, reviver);
}

async function getTheJson(url) {
    try {
        let response = await fetch(url);
        let data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to load JSON file:", error);
    }
}

(async function () {
    canvas = window._canvas = new fabric.Canvas("canvas", {});
    fabric.Object.prototype.set({});
    
    popover = document.getElementById("popover");
    jsonObject = await getTheJson(jsonFilePath);
    draw();
})();
