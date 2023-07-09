import { isRoom, getTheJson } from "./utilities.js";

let jsonObject;
let canvas;
let popover;
const initialOpacity = 0.5;
const hoverOpacity = 0.9;

const drawFunction = () => {
    const { width, height } = jsonObject.objects[0];

    canvas.setDimensions({ width, height });

    canvas.getObjects().forEach(function (obj) {
        if(isRoom(obj)) {
            obj.set('opacity', initialOpacity);
        }

        obj.selectable = false;
        obj.interactive = false;
    });

    canvas.calcOffset();
    canvas.renderAll();

    canvas.on('mouse:over', function(event) {
        if(isRoom(event.target)) {
            event.target.set('opacity', hoverOpacity);
            canvas.renderAll();
            showPopover(event.target);
        }
        
    });

    canvas.on('mouse:out', function(event) {
        if(isRoom(event.target)) {
            event.target.set('opacity', initialOpacity);
            canvas.renderAll();
            hidePopover();
        }
        
    });
    
    canvas.calcOffset();
    canvas.renderAll();
};

const showPopover = (object) => {
    console.log("showing popver");
    popover.innerHTML = object.type +object.id; //square.popoverText;
    popover.style.display = "block";
    const popoverWidth = popover.offsetWidth;
    const popoverHeight = popover.offsetHeight;
    const objectCoords = canvas.getAbsoluteCoords(object);
    
    const scaleX = canvas.wrapperEl.clientWidth / canvas.getWidth();
    const scaleY = canvas.wrapperEl.clientHeight / canvas.getHeight();
    
    const left = (objectCoords.left + object.width) * scaleX + 10;
    const top = (objectCoords.top + object.height / 2) * scaleY - popoverHeight / 2;
    
    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
    
    console.log(left, top);
  
};

const hidePopover = () => {
    popover.style.display = "none";
};

const reviver = (o, object) => {
    fabric.log(o, object);
};


(async function () {
    canvas = window._canvas = new fabric.Canvas("canvas", {});
    const canvasElement = document.getElementById("canvas");
    popover = document.getElementById("popover");
    
    fabric.Object.prototype.set({});
    fabric.Canvas.prototype.getAbsoluteCoords = function(object) {

        const scaleX = this.wrapperEl.clientWidth / this.getWidth();
        const scaleY = this.wrapperEl.clientHeight / this.getHeight();
        console.log(canvas);
        return {
          left: (object.left + this.wrapperEl.offsetLeft) * scaleX,
          top: (object.top + this.wrapperEl.offsetTop) * scaleY
        };
      }
    
    jsonObject = await getTheJson("/assets/data/sample_json_from_farbicjs.json");
    
    canvas.loadFromJSON(jsonObject, drawFunction, reviver);

    window.onresize = function(event) {
        console.log(canvas.getBoundingRect(), canvas.getAbsoluteCoords(canvas.getBoundingRect()));
    };

})();
