// A Javascript program to check if a given point
// lies inside a given polygon
// Refer https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
// for explanation of functions onSegment(),
// orientation() and doIntersect()

// Define Infinite (Using INT_MAX
// caused overflow problems)
let INF = 10000;

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// Given three collinear points p, q, r,
// the function checks if point q lies
// on line segment 'pr'
function onSegment(p, q, r) {
  if (
    q.x <= Math.max(p.x, r.x) &&
    q.x >= Math.min(p.x, r.x) &&
    q.y <= Math.max(p.y, r.y) &&
    q.y >= Math.min(p.y, r.y)
  ) {
    return true;
  }
  return false;
}

// To find orientation of ordered triplet (p, q, r).
// The function returns following values
// 0 --> p, q and r are collinear
// 1 --> Clockwise
// 2 --> Counterclockwise
function orientation(p, q, r) {
  let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

  if (val == 0) {
    return 0; // collinear
  }
  return val > 0 ? 1 : 2; // clock or counterclock wise
}

// The function that returns true if
// line segment 'p1q1' and 'p2q2' intersect.
function doIntersect(p1, q1, p2, q2) {
  // Find the four orientations needed for
  // general and special cases
  let o1 = orientation(p1, q1, p2);
  let o2 = orientation(p1, q1, q2);
  let o3 = orientation(p2, q2, p1);
  let o4 = orientation(p2, q2, q1);

  // General case
  if (o1 != o2 && o3 != o4) {
    return true;
  }

  // Special Cases
  // p1, q1 and p2 are collinear and
  // p2 lies on segment p1q1
  if (o1 == 0 && onSegment(p1, p2, q1)) {
    return true;
  }

  // p1, q1 and p2 are collinear and
  // q2 lies on segment p1q1
  if (o2 == 0 && onSegment(p1, q2, q1)) {
    return true;
  }

  // p2, q2 and p1 are collinear and
  // p1 lies on segment p2q2
  if (o3 == 0 && onSegment(p2, p1, q2)) {
    return true;
  }

  // p2, q2 and q1 are collinear and
  // q1 lies on segment p2q2
  if (o4 == 0 && onSegment(p2, q1, q2)) {
    return true;
  }

  // Doesn't fall in any of the above cases
  return false;
}

// Returns true if the point p lies
// inside the polygon[] with n vertices
function isInside(polygon, n, p) {
  // There must be at least 3 vertices in polygon[]
  if (n < 3) {
    return false;
  }

  // Create a point for line segment from p to infinite
  let extreme = new Point(INF, p.y);

  // Count intersections of the above line
  // with sides of polygon
  let count = 0,
    i = 0;
  do {
    let next = (i + 1) % n;

    // Check if the line segment from 'p' to
    // 'extreme' intersects with the line
    // segment from 'polygon[i]' to 'polygon[next]'
    if (doIntersect(polygon[i], polygon[next], p, extreme)) {
      // If the point 'p' is collinear with line
      // segment 'i-next', then check if it lies
      // on segment. If it lies, return true, otherwise false
      if (orientation(polygon[i], p, polygon[next]) == 0) {
        return onSegment(polygon[i], p, polygon[next]);
      }

      count++;
    }
    i = next;
  } while (i != 0);

  // Return true if count is odd, false otherwise
  return count % 2 == 1; // Same as (count%2 == 1)
}

// This code is contributed by rag2127

// console.log(jsonData.features[0].geometry.coordinates[0].length);

// given latitude and longitude of the current location
// return the name of district (according to the name in the db)
function returnDistrict(lat, long) {
  const redNorthLayer = require("../data/zone-red-north.json");
  console.log(redNorthLayer.features[0].properties.name);
  const blueNorthLayer = require("../data/zone-blue-north.json");
  console.log(blueNorthLayer.features[0].properties.name);
  const purpleNorthLayer = require("../data/zone-purple-north.json");
  console.log(purpleNorthLayer.features[0].properties.name);
  const greenNorthLayer = require("../data/zone-green-north.json");
  console.log(greenNorthLayer.features[0].properties.name);
  const yellowNorthLayer = require("../data/zone-yellow-north.json");
  console.log(yellowNorthLayer.features[0].properties.name);
  const redSouthLayer = require("../data/zone-red-south.json");
  console.log(redSouthLayer.features[0].properties.name);
  const blueSouthLayer = require("../data/zone-blue-south.json");
  console.log(blueSouthLayer.features[0].properties.name);
  const purpleSouthLayer = require("../data/zone-purple-south.json");
  console.log(purpleSouthLayer.features[0].properties.name);
  const greenSouthLayer = require("../data/zone-green-south.json");
  console.log(greenSouthLayer.features[0].properties.name);
  const yellowSouthLayer = require("../data/zone-yellow-south.json");
  console.log(yellowSouthLayer.features[0].properties.name);

  let zones = [
    redNorthLayer,
    blueNorthLayer,
    purpleNorthLayer,
    greenNorthLayer,
    yellowNorthLayer,
    redSouthLayer,
    blueSouthLayer,
    purpleSouthLayer,
    greenSouthLayer,
    yellowSouthLayer,
  ];

  //   loop for all ten zones
  for (let z = 0; z < zones.length; z++) {
    const numOfDistricts = zones[z].features.length;
    // loop for multiple districts within zone (for blue)
    for (let d = 0; d < numOfDistricts; d++) {
      var polygon = new Array();
      const coordinates = zones[z].features[d].geometry.coordinates[0];
      const numOfCoor = coordinates.length;
      // loop through the list of coordinates to put it into polygon
      for (let i = 0; i < numOfCoor; i++) {
        var point = new Point(coordinates[i][1], coordinates[i][0]);
        polygon.push(point);
      }
      var currPoint = new Point(lat, long);
      var coorLength = polygon.length;
      if (isInside(polygon, coorLength, currPoint)) {
        var dbname = returnDBequiv(zones[z].features[d].properties.name);
        console.log(dbname);
        return dbname;
      }
    }
  }
  console.log("this address is not within the vancouver district");
  return false;
}

export { returnDistrict };

function returnDBequiv(jsonFileName) {
  switch (jsonFileName) {
    case "Red-North":
      return "N-red";
    case "Blue-North2":
      return "N-blue";
    case "Blue-North":
      return "N-blue";
    case "Purple-North":
      return "N-purple";
    case "Green-North":
      return "N-green";
    case "Yellow-North":
      return "N-yellow";
    case "Red-South":
      return "S-red";
    case "Blue-South":
      return "S-blue";
    case "Purple-South":
      return "S-purple";
    case "Green-South":
      return "S-green";
    case "Yellow-South":
      return "S-yellow";
    case "Blue-South":
      return "S-blue";
    default:
      return " ";
  }
}
