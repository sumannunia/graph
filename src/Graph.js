import React from 'react'
import { Bezier } from "bezier-js";

function Graph() {
/* 
 * Canvas curves example
 *
 * By Craig Buckler,		http://twitter.com/craigbuckler
 * of OptimalWorks.net		http://optimalworks.net/
 * for SitePoint.com		http://sitepoint.com/
 * 
 * Refer to:
 * http://blogs.sitepoint.com/html5-canvas-draw-quadratic-curves/
 * http://blogs.sitepoint.com/html5-canvas-draw-bezier-curves/
 *
 * This code can be used without restriction. 
 */


 




    window.onload = function () {
     
        (function() {

            var canvas, ctx, code, point, style, drag = null, dPoint, curve, LUT;

            // define initial points
            function Init(quadratic) {

                point = {
                    p1: { x:100, y:250 },
                    p2: { x:400, y:250 },
                    p3: { x:200, y:250 }
                };
                // console.log(point)
                if (quadratic) {
                    point.cp1 = { x: 250, y: 100 };
                }
                else {
                    point.cp1 = { x: 150, y: 100 };
                    point.cp2 = { x: 350, y: 100 };
                    point.cp3 = { x: 250, y: 100 };
                }
                
                // default styles
                style = {
                    curve:	{ width: 6, color: "#333" },
                    cpline:	{ width: 1, color: "#C00" },
                    point: { radius: 10, width: 2, color: "#900", fill: "rgba(200,200,200,0.5)", arc1: 0, arc2: 2 * Math.PI }
                }
                
                // line style defaults
                ctx.lineCap = "round";
                ctx.lineJoin = "round";

                // event handlers
                canvas.onmousedown = DragStart;
                canvas.onmousemove = Dragging;
                canvas.onmouseup = canvas.onmouseout = DragEnd;
                
                DrawCanvas();
            }
            
            
            // draw canvas
            function DrawCanvas() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // control lines
                ctx.lineWidth = style.cpline.width;
                ctx.strokeStyle = style.cpline.color;
                ctx.beginPath();
                ctx.moveTo(point.p1.x, point.p1.y);
                ctx.lineTo(point.cp1.x, point.cp1.y);
                if (point.cp2) {
                    ctx.moveTo(point.p2.x, point.p2.y);
                    ctx.lineTo(point.cp2.x, point.cp2.y);
                }
                else {
                    ctx.lineTo(point.p2.x, point.p2.y);
                }
                ctx.stroke();
                
                // curve
                ctx.lineWidth = style.curve.width;
                ctx.strokeStyle = style.curve.color;
                ctx.beginPath();
                ctx.moveTo(point.p1.x, point.p1.y);
                if (point.cp2) {
                    ctx.bezierCurveTo(point.cp1.x, point.cp1.y, point.cp2.x, point.cp2.y, point.p2.x, point.p2.y);
                }
                else {
                    ctx.quadraticCurveTo(point.cp1.x, point.cp1.y, point.p2.x, point.p2.y);
                }
                ctx.stroke();

                // control points
                for (var p in point) {
                    // console.log(p)
                    ctx.lineWidth = style.point.width;
                    ctx.strokeStyle = style.point.color;
                    ctx.fillStyle = style.point.fill;
                    ctx.beginPath();
                    ctx.arc(point[p].x, point[p].y, style.point.radius, style.point.arc1, style.point.arc2, true);
                    ctx.fill();
                    ctx.stroke();
                }
                
                ShowCode();
                
            }
            
            
            // show canvas code
            function ShowCode() {
                if (code) {
                    code.firstChild.nodeValue = 
                        "canvas = document.getElementById(\"canvas\");\n"+
                        "ctx = canvas.getContext(\"2d\")\n"+
                        "ctx.lineWidth = " + style.curve.width +
                        ";\nctx.strokeStyle = \"" + style.curve.color +
                        "\";\nctx.beginPath();\n" +
                        "ctx.moveTo(" + point.p1.x + ", " + point.p1.y +");\n" +
                        (point.cp2 ? 
                            "ctx.bezierCurveTo("+point.cp1.x+", "+point.cp1.y+", "+point.cp2.x+", "+point.cp2.y+", "+point.p2.x+", "+point.p2.y+");" :
                            "ctx.quadraticCurveTo("+point.cp1.x+", "+point.cp1.y+", "+point.p2.x+", "+point.p2.y+");"
                        ) +
                        "\nctx.stroke();"
                    ;
                }
            }
            
            
            // start dragging
            function DragStart(e) {
                e = MousePos(e);
                console.log(e)
                var dx, dy;
                for (var p in point) {
                    dx = point[p].x - e.x;
                    dy = point[p].y - e.y;
                    if ((dx * dx) + (dy * dy) < style.point.radius * style.point.radius) {
                        drag = p;
                        dPoint = e;
                        canvas.style.cursor = "move";
                        return;
                    }
                }
            }
            
            
            // dragging
            function Dragging(e) {
                if (drag) {
                    e = MousePos(e);
                    point[drag].x += e.x - dPoint.x;
                    point[drag].y += e.y - dPoint.y;
                    dPoint = e;
                    DrawCanvas();
                }
            }
            
            
            // end dragging
            function DragEnd(e) {
                let pos = MousePos(e);
                // console.log(pos)
                curve = new Bezier(pos.x, pos.x+100, pos.y, 100, 400, 250);
                drag = null;
                canvas.style.cursor = "default";
                DrawCanvas();
                LUT = curve.getLUT(16);
                console.log('lut', LUT)
                
            }

            
            // event parser
            function MousePos(event) {
                event = (event ? event : window.event);
                return {
                    x: event.pageX - canvas.offsetLeft,
                    y: event.pageY - canvas.offsetTop
                }
            }
            
            
            // start 
            canvas = document.getElementById("canvas");
            code = document.getElementById("code");
            canvas.width = 500;
            canvas.height = 500;
            if (canvas.getContext) {
                ctx = canvas.getContext("2d");
                Init(canvas.className == "quadratic");
                ctx.lineWidth = 6;
                ctx.strokeStyle = "#333";
                ctx.beginPath();
                ctx.moveTo(100, 250);
                ctx.bezierCurveTo(150, 100, 350, 100, 400, 250);
                ctx.stroke();
                curve = new Bezier(150, 100, 350, 100, 400, 250);
                // console.log(curve);
                let bbox = JSON.stringify(curve.bbox());
                // console.log(bbox);
                console.log(JSON.parse(bbox));
                LUT = curve.getLUT(16);
                // console.log('lut', LUT)
            }
            //  let canvas = document.getElementById("canvas");
            //  let ctx = canvas.getContext("2d");
            
        })();

   }
    return (
        <div>
            <canvas id="canvas"></canvas>
        </div>
    )
}

export default Graph
