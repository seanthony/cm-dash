
const keyColors = [
    { "key": "level_3", "color": "#8e8884" },
    { "key": "level_4", "color": "#081e32" },
    { "key": "level_5", "color": "#1996aa" },
    { "key": "level_2", "color": "#ffe000" },
    { "key": "level_1", "color": "#dc5756" }
];
const darkColor = d3.rgb("#081e32");

function draw() {
    document.getElementById('output').innerHTML = '';
    const divWidth = document.getElementById('wrapper').clientWidth;
    const step = 22;
    const colWidth = Math.floor((divWidth - (3 * step)) / 4 / step) * step - step;
    const r = 10;

    const keys = ["CM Wellness", "Sustainment", "Literacy", "Student Voice"];
    let mxTop = 0;
    let mxBottom = 0;
    for (let key of keys) {
        let obj = DATA[key];
        let c = obj['level_3'].length + obj['level_4'].length + obj['level_5'].length;
        mxTop = Math.max(mxTop, c);
        c = obj['level_2'].length + obj['level_1'].length;
        mxBottom = Math.max(mxBottom, c);
    }

    const midRows = Math.ceil((mxTop + 3) / (colWidth / step)) * step;
    const bottomRows = Math.ceil((mxBottom + 2) / (colWidth / step)) * step;

    const w = Math.round(colWidth * 4 + 3 * step);
    const h = midRows + bottomRows + 2.5 * step;
    let svg = d3.select("#output").append("svg").attr("width", w).attr("height", h)

    function addData(obj, wStart, key) {
        let dx = wStart;
        let dy = midRows;
        let g = svg.append('g');
        let atAndAbove = 0;
        for (let o of keyColors.slice(0, 3)) {
            let color = d3.rgb(o.color);
            let level = obj[o.key];
            g.append("circle")
                .style("stroke", color)
                .style("fill", "white")
                .attr("r", r)
                .attr("cx", dx)
                .attr("cy", dy);
            atAndAbove += level.length;
            let text = Math.round(level.length / obj.size * 100) + '%';
            g.append("text")
                .style("fill", color)
                .style("font-family", "Calibri")
                .style("font-size", "8px")
                .style("text-anchor", "middle")
                .attr("x", dx)
                .attr("y", dy + .2 * r)
                .text(text);

            dx += step;
            if (dx >= (wStart + colWidth)) {
                dx = wStart;
                dy -= step;
            }

            for (let cm of level) {
                g.append("circle")
                    .style("stroke", color)
                    .style("fill", color)
                    .attr("r", r)
                    .attr("cx", dx)
                    .attr("cy", dy)
                    .append("svg:title")
                    .text(cm);
                dx += step;
                if (dx >= (wStart + colWidth)) {
                    dx = wStart;
                    dy -= step;
                }
            }
        }

        g.append("rect")
            .style("stroke", "white")
            .style("fill", "white")
            .attr("width", colWidth)
            .attr("height", 2 * step)
            .attr("x", wStart - .5 * step)
            .attr("y", midRows + .5 * step);

        g.append("text")
            .style("fill", darkColor)
            .style("font-family", "Calibri")
            .style("font-size", "16px")
            .style("text-anchor", "middle")
            .attr("x", wStart + .5 * colWidth - .5 * step)
            .attr("y", midRows + 1.5 * step)
            .text(key);

        let text = Math.round(atAndAbove / obj.size * 100) + '%';
        g.append("text")
            .style("fill", darkColor)
            .style("font-family", "Calibri")
            .style("font-size", "16px")
            .style("text-anchor", "middle")
            .attr("x", wStart + .5 * colWidth - .5 * step)
            .attr("y", midRows + (2 * step))
            .text(text);

        dx = wStart;
        dy = midRows + 3 * step;

        let red = d3.rgb('#dc5756');

        for (let o of keyColors.slice(3)) {
            let color = d3.rgb(o.color);
            let level = obj[o.key];
            for (let cm of level) {
                g.append("circle")
                    .style("stroke", color)
                    .style("fill", color)
                    .attr("r", r)
                    .attr("cx", dx)
                    .attr("cy", dy)
                    .append("svg:title")
                    .text(cm);
                dx += step;
                if (dx >= (wStart + colWidth)) {
                    dx = wStart;
                    dy += step;
                }
            }
            g.append("circle")
                .style("stroke", color)
                .style("fill", "white")
                .attr("r", r)
                .attr("cx", dx)
                .attr("cy", dy);

            let text = Math.round(level.length / obj.size * 100) + '%'
            g.append("text")
                .style("fill", red)
                .style("font-family", "Calibri")
                .style("font-size", "8px")
                .style("text-anchor", "middle")
                .attr("x", dx)
                .attr("y", dy + .2 * r)
                .text(text);

            dx += step;
            if (dx >= (wStart + colWidth)) {
                dx = wStart;
                dy += step;
            }
        }
    }

    for (let i in keys) {
        addData(DATA[keys[i]], i * colWidth + (step / 2) + i * step, keys[i]);
    }

    const inactive = DATA['inactive']['cms'];
    const inactiveSize = DATA['inactive'].size;
    const size = inactiveSize + DATA['Student Voice'].size;

    let H = Math.ceil(step * (inactiveSize / (w / step))) + 1.5 * step;
    svg = d3.select("#output").append("svg").attr("width", w).attr("height", H);
    let g = svg.append('g');
    let dx = step / 2;
    let dy = step + step / 2;
    const gray = d3.rgb("#8e8884");
    for (let cm of inactive) {
        g.append("circle")
            .style("stroke", gray)
            .style("fill", "white")
            .attr("r", r)
            .attr("cx", dx)
            .attr("cy", dy)
            .append("svg:title")
            .text(cm);

        dx += step;
        if (dx >= w) {
            dx = step;
            dy += step;
        }

    }

    g.append("circle")
        .style("stroke", gray)
        .style("fill", "white")
        .attr("r", r)
        .attr("cx", dx)
        .attr("cy", dy);

    let text = Math.round(inactiveSize / size * 100) + '%'
    g.append("text")
        .style("fill", gray)
        .style("font-family", "Calibri")
        .style("font-size", "8px")
        .style("text-anchor", "middle")
        .attr("x", dx)
        .attr("y", dy + .2 * r)
        .text(text);
    console.log(size);

}

draw();
window.onresize = draw;