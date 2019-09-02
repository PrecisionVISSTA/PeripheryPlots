


export function rotate (cx, cy, x, y, deg) {
    /*
    Rotatate the point (x,y) around the origin (cx,cy) 
    by some angle (degrees)
    */
    let rad = (Math.PI / 180) * deg,
        cos = Math.cos(rad),
        sin = Math.sin(rad),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
} 
        
export function stringifyPoints (points) {
    /*
    Array of points [[x1,x2], ..., etc.] => string representation for svg 'points' property 
    */
    return points.reduce((acc,cur) => (`${acc}${cur[0]},${cur[1]} `), '')
}
        
export function getEquilateralTriangleFromCentroid(centroid, s, o) {
    /*
    returns an equilateral triangle (defined as [[x1,y1], ..., etc.]) 
    s is the distance from the geometric centroid to each of the vertices 
    o is the orientation of the triangle (1 is UP, 0 is DOWN) 
    */ 
    let {x,y} = centroid; 
    if (o == 0) {
        //triangle points up if there was no change 
        o = 1;
    }
    let so = s*o; 
    let dv = so/2; 
    let dh = so/2*Math.sqrt(3); 
    return [[x,y+so],[x-dh,y-dv],[x+dh,y-dv]];
}
        
export function tupdif(tup) {
    return tup[1] - tup[0];
}

export function rangeeq(arr1, arr2) { 
    return arr1[0] === arr2[0] && arr1[1] === arr2[1]; 
}

export function logicalAndOver(arr) {
    return arr.reduce((acc, cur) => acc && cur, true); 
}

export function logicalOrOver(arr) {
    return arr.reduce((acc, cur) => acc || cur, false); 
}

export function rangeIntersection(ar, br) {
    /*
    Determines if two intervals overlap. If the intervals overlap we return 
    an array [oStart, oEnd]. If not, we return an empty array. 
    */
    let [a0, a1] = ar; 
    let [b0, b1] = br; 
    let intersection = b0 <= a1 ? [b0, a1] 
                     : a0 <= b1 ? [a0, b1] 
                     : []; 
    let didIntersect = intersection.length == 2; 
    return didIntersect, intersection; 
}

export function zip(a,b) {
    let zipped = []; 
    for (let i = 0; i < a.length; i++) {
        zipped.push([a[i], b[i]]); 
    }
    return zipped; 
}

export function scaleRangeToBox(xRange, yRange, xScale, yScale) {
    /*
    Scale a d3 scale object to (optionally) specified ranges 
    */
    if (xScale) 
        xScale.range(xRange); 
    if (yScale)
        yScale.range(yRange); 

    return { xScale: xScale, yScale: yScale }; 
}

export function padDateRange(msecsPadding, range) {
    /*
    Take a range of javascript date objects and widens it by msecsPadding on both sides 
    */
    return [
        new Date(range[0].valueOf() - msecsPadding), 
        new Date(range[1].valueOf() + msecsPadding)
    ]; 
}