import { isRoom, getTheJson } from "./utilities.js";

let jsonObject;
let canvas;
let popover;
let workspace;
let workspaceEl;
const initialOpacity = 0.5;
const hoverOpacity = 0.9;

const drawFunction = () => {
    const { width, height } = jsonObject.objects[0];

    canvas.setDimensions({ width, height });

    canvas.getObjects().forEach(function (obj) {
        if (isRoom(obj)) {
            obj.set("opacity", initialOpacity);
        }

        obj.selectable = false;
        obj.interactive = false;
    });

    canvas.calcOffset();
    canvas.renderAll();

    canvas.on("mouse:over", function (event) {
        if (isRoom(event?.target)) {
            event.target.set("opacity", hoverOpacity);
            canvas.renderAll();
            showPopover(event.target);
        }
    });

    canvas.on("mouse:out", function (event) {
        if (isRoom(event?.target)) {
            event.target.set("opacity", initialOpacity);
            canvas.renderAll();
            hidePopover();
        }
    });

    canvas.calcOffset();
    canvas.renderAll();

    
};

const showPopover = (object) => {
    popover.innerHTML = object.type + object.id; //square.popoverText;
    popover.style.display = "block";
    const popoverHeight = popover.offsetHeight;
    const objectCoords = canvas.getAbsoluteCoords(object);

    const scaleX = canvas.wrapperEl.clientWidth / canvas.getWidth();
    const scaleY = canvas.wrapperEl.clientHeight / canvas.getHeight();

    const left = (objectCoords.left + object.width) * scaleX + 10;
    const top = (objectCoords.top + object.height / 2) * scaleY - popoverHeight / 2;

    popover.style.left = `${left}px`;
    popover.style.top = `${top}px`;
};

const hidePopover = () => {
    popover.style.display = "none";
};

const reviver = (o, object) => {
    //fabric.log(o, object);
    console.log('inside Reviver')
};

const _initResizeObserve = () => {
    const resizeObserver = new ResizeObserver(auto);
    resizeObserver.observe(workspaceEl);
};

const auto = () => {
    const scale = _getScale();
    setZoomAuto(scale - 0.08);
};

const _getScale = () => {
    //console.log(workspaceEl)
    const viewPortWidth = workspaceEl.offsetWidth;
    const viewPortHeight = workspaceEl.offsetHeight;
    // by width or height
    if (viewPortWidth / viewPortHeight < 1700 / 760) {
        return viewPortWidth / 1700;
    } // scale by width ratio
    return viewPortHeight / 760;
};

const setZoomAuto = (scale, cb) => {
    const width = workspaceEl.offsetWidth;
    const height = workspaceEl.offsetHeight;
    canvas.setWidth(width);
    canvas.setHeight(height);
    const center = canvas.getCenter();
    canvas.setViewportTransform(fabric.iMatrix.concat());
    canvas.zoomToPoint(new fabric.Point(center.left, center.top), scale);
    setCenterFromObject(workspace);
};

const setCenterFromObject = (obj) => {
    const objCenter = obj.getCenterPoint();
    const viewportTransform = canvas.viewportTransform;
    if (canvas.width === undefined || canvas.height === undefined || !viewportTransform) return;
    viewportTransform[4] = canvas.width / 2 - objCenter.x * viewportTransform[0];
    viewportTransform[5] = canvas.height / 2 - objCenter.y * viewportTransform[3];
    canvas.setViewportTransform(viewportTransform);
    canvas.renderAll();
};

const loadCanvasFromJSON = () => {
    return new Promise((resolve, reject) => {
      canvas.loadFromJSON(jsonObject, () => {
        drawFunction();
        resolve();
      }, reviver);
    });
  };

(async function () {
    workspaceEl = document.getElementById("workspace");
    popover = document.getElementById("popover");

    canvas = window._canvas = new fabric.Canvas("canvas", {});
    
    fabric.Object.prototype.set({});
    fabric.Canvas.prototype.getAbsoluteCoords = function (object) {
        const scaleX = canvas.wrapperEl.clientWidth / canvas.getWidth();
        const scaleY = canvas.wrapperEl.clientHeight / canvas.getHeight();
        return {
            left: (object.left + canvas.wrapperEl.offsetLeft) * scaleX,
            top: (object.top + canvas.wrapperEl.offsetTop) * scaleY,
        };
    };

    jsonObject = await getTheJson("/assets/data/sample_json_from_farbicjs.json");

    await loadCanvasFromJSON();

    console.log(`after the call loadFromJson`)

    // sleep for 5 seconds
    //await new Promise(r => setTimeout(r, 5000));
    workspace = canvas;
    console.log('item 1', canvas.item(0))

    _initResizeObserve();
})();
