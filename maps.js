// maps.js - extracted from maps.html
const mapData = {
    'silk-road': {
        title: 'The Silk Road (130 BCE - 1453 CE)',
        description: 'An ancient network of trade routes connecting East and West, facilitating not just commerce but cultural exchange, spreading ideas, religions, and technologies across continents.',
        routes: [
            {path: [[103, 36], [95, 42], [85, 45], [75, 41], [69, 34], [60, 32]], color: '#ff6b6b', label: 'Northern Route'},
            {path: [[103, 36], [98, 32], [92, 30], [85, 29], [75, 32], [60, 32]], color: '#4ecdc4', label: 'Central Route'},
            {path: [[103, 25], [95, 22], [85, 20], [75, 22], [65, 28], [60, 32]], color: '#ffe66d', label: 'Southern Route'}
        ],
        cities: [
            {name: 'Chang\'an', coords: [108.9, 34.3], desc: 'Starting point of the Silk Road'},
            {name: 'Samarkand', coords: [66.9, 39.6], desc: 'Major trading hub'},
            {name: 'Baghdad', coords: [44.4, 33.3], desc: 'Center of Islamic Golden Age'},
            {name: 'Constantinople', coords: [28.9, 41.0], desc: 'Gateway to Europe'},
            {name: 'Venice', coords: [12.3, 45.4], desc: 'European terminus'}
        ]
    },
    'napoleon': {
        title: 'Napoleonic Empire (1804-1815)',
        description: 'At its height, Napoleon\'s empire dominated much of continental Europe, spreading revolutionary ideals, legal reforms, and modern administrative systems across the continent.',
        territories: [
            // France proper
            {coords: [[-1.5, 47.2], [-1.5, 49.5], [1.0, 51.0], [4.4, 51.2], [5.9, 50.8], [8.5, 47.4], [7.3, 43.7], [5.4, 43.3], [3.0, 42.5], [0.1, 43.6], [-1.5, 47.2]], color: '#e74c3c'},
            // Italy
            {coords: [[6.8, 44.0], [7.3, 43.7], [8.5, 39.2], [9.5, 38.0], [12.5, 37.5], [14.3, 40.8], [12.5, 41.9], [11.0, 43.0], [9.2, 45.5], [6.8, 44.0]], color: '#c0392b'},
            // Netherlands/Belgium region
            {coords: [[2.3, 48.9], [1.0, 51.0], [4.4, 51.2], [6.1, 50.2], [7.0, 50.8], [10.5, 51.5], [13.4, 52.5], [10.5, 53.5], [6.1, 53.2], [3.0, 53.0], [2.0, 51.0], [2.3, 48.9]], color: '#e67e22'}
        ],
        cities: [
            {name: 'Paris', coords: [2.3, 48.9], desc: 'Capital of the Empire'},
            {name: 'Milan', coords: [9.2, 45.5], desc: 'Kingdom of Italy'},
            {name: 'Madrid', coords: [-3.7, 40.4], desc: 'Spanish campaign'},
            {name: 'Vienna', coords: [16.4, 48.2], desc: 'Allied territory'},
            {name: 'Moscow', coords: [37.6, 55.8], desc: 'Campaign of 1812'}
        ]
    },
    'roman': {
        title: 'Roman Empire (117 CE - Peak)',
        description: 'The largest empire of ancient times, Rome unified the Mediterranean world, creating a vast network of roads, spreading Latin culture, law, and engineering marvels that still stand today.',
        territories: [
            {coords: [[12.5, 41.9], [14.5, 37.5], [16.5, 40.5], [19.8, 39.6], [23.7, 38.0], [28.9, 41.0], [35.5, 38.0], [36.0, 34.0], [31.2, 30.0], [25.0, 32.5], [10.0, 36.8]], color: '#9b59b6'},
            {coords: [[-8.0, 37.0], [-6.0, 40.0], [-3.7, 40.4], [2.3, 43.3], [7.3, 43.7], [12.5, 41.9], [10.0, 36.8], [3.0, 36.8], [-5.5, 35.8]], color: '#8e44ad'},
            {coords: [[2.3, 51.0], [7.0, 51.5], [10.5, 47.5], [7.3, 43.7], [2.3, 43.3], [-1.5, 47.2]], color: '#674ea7'}
        ],
        cities: [
            {name: 'Rome', coords: [12.5, 41.9], desc: 'Eternal City, capital'},
            {name: 'Constantinople', coords: [28.9, 41.0], desc: 'Eastern capital'},
            {name: 'Alexandria', coords: [29.9, 31.2], desc: 'Egyptian jewel'},
            {name: 'Londinium', coords: [-0.1, 51.5], desc: 'British outpost'},
            {name: 'Carthage', coords: [10.3, 36.8], desc: 'African province'}
        ]
    },
    'mongol': {
        title: 'Mongol Empire (1206-1368)',
        description: 'The largest contiguous land empire in history, stretching from Eastern Europe to the Sea of Japan, the Mongols revolutionized warfare, trade, and communication across Eurasia.',
        territories: [
            // Eastern region (China/Mongolia)
            {coords: [[105, 40], [108, 45], [115, 48], [120, 50], [130, 52], [135, 48], [140, 42], [138, 35], [128, 38], [115, 35], [105, 40]], color: '#16a085'},
            // Central region (Central Asia)
            {coords: [[70, 55], [75, 50], [80, 52], [90, 50], [95, 48], [105, 42], [105, 40], [95, 38], [90, 45], [80, 48], [75, 50], [70, 55]], color: '#1abc9c'},
            // Western region (Persia/Caucasus)
            {coords: [[45, 40], [50, 48], [55, 50], [65, 50], [70, 48], [75, 45], [75, 50], [70, 43], [65, 45], [60, 42], [55, 43], [50, 40], [45, 40]], color: '#27ae60'},
            // Middle East region
            {coords: [[35, 35], [40, 30], [50, 32], [55, 38], [55, 43], [50, 40], [45, 40], [40, 38], [35, 35]], color: '#2ecc71'}
        ],
        cities: [
            {name: 'Karakorum', coords: [102.8, 47.2], desc: 'Mongol capital'},
            {name: 'Beijing', coords: [116.4, 39.9], desc: 'Yuan Dynasty capital'},
            {name: 'Sarai', coords: [47.5, 48.0], desc: 'Golden Horde capital'},
            {name: 'Baghdad', coords: [44.4, 33.3], desc: 'Conquered in 1258'},
            {name: 'Kiev', coords: [30.5, 50.5], desc: 'Western conquest'}
        ]
    },
    'ottoman': {
        title: 'Ottoman Empire (1683 - Peak)',
        description: 'A powerful Islamic empire spanning three continents, the Ottomans controlled key trade routes, preserved classical knowledge, and created a rich cultural synthesis of East and West.',
        territories: [
            {coords: [[26.0, 40.0], [28.9, 41.0], [35.0, 41.0], [42.0, 38.0], [35.0, 34.0], [28.0, 36.5], [23.7, 38.0]], color: '#c0392b'},
            {coords: [[28.9, 41.0], [26.0, 40.0], [20.0, 42.0], [17.0, 44.5], [19.0, 46.0], [22.5, 44.5]], color: '#e74c3c'},
            {coords: [[28.0, 36.5], [35.0, 34.0], [35.5, 30.0], [31.2, 30.0], [25.0, 31.5]], color: '#d35400'},
            {coords: [[17.0, 44.5], [14.0, 45.5], [16.4, 48.2], [19.0, 47.5], [19.0, 46.0]], color: '#e67e22'}
        ],
        cities: [
            {name: 'Constantinople', coords: [28.9, 41.0], desc: 'Imperial capital (Istanbul)'},
            {name: 'Cairo', coords: [31.2, 30.0], desc: 'Egyptian province'},
            {name: 'Mecca', coords: [39.8, 21.4], desc: 'Holy city'},
            {name: 'Baghdad', coords: [44.4, 33.3], desc: 'Mesopotamian center'},
            {name: 'Vienna', coords: [16.4, 48.2], desc: 'Failed siege 1683'}
        ]
    }
};

const width = 1200;
const height = 600;
let currentMap = 'silk-road';

const svg = d3.select('#map')
    .attr('width', '100%')
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`);

const g = svg.append('g');
const countriesGroup = g.append('g').attr('class', 'countries-group');
const featuresGroup = g.append('g').attr('class', 'features-group');

// projection and path will be configured per-map (using fitExtent when possible)
let projection = d3.geoMercator();
let path = d3.geoPath().projection(projection);

const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on('zoom', (event) => {
        g.attr('transform', event.transform);
    });

svg.call(zoom);

const tooltip = d3.select('#tooltip');

// Theme initialization: respect stored preference or system default
function initTheme() {
    const stored = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark', stored === 'dark');
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Back button handler
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    const backBtn = document.getElementById('back-btn');
    if (backBtn) backBtn.addEventListener('click', () => { window.location.href = 'index.html'; });
});

// Load world geometry and render map
fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    .then(resp => resp.json())
    .then(data => {
        const countries = topojson.feature(data, data.objects.countries);
        // store for redraws when projection changes
        window.__worldCountries = countries.features;

        // initial append of country paths (d will be set/updated in renderMap)
        countriesGroup.selectAll('path')
            .data(window.__worldCountries)
            .enter().append('path')
            .attr('class', 'country');

        renderMap(currentMap);
    })
    .catch(err => console.error('Failed to load world data', err));

function renderMap(mapName) {
    currentMap = mapName;
    const data = mapData[mapName];

    // clear previous features
    featuresGroup.selectAll('*').remove();

    document.getElementById('map-title').textContent = data.title;
    document.getElementById('map-description').textContent = data.description;

    const legend = document.getElementById('legend');
    legend.innerHTML = '';

    // Build GeoJSON features collection
    const fc = { type: 'FeatureCollection', features: [] };

    if (data.territories) {
        data.territories.forEach(territory => {
            const ring = territory.coords.slice();
            const first = ring[0];
            const last = ring[ring.length - 1];
            if (first[0] !== last[0] || first[1] !== last[1]) ring.push(first);
            fc.features.push({ type: 'Feature', geometry: { type: 'Polygon', coordinates: [ring] }, properties: { fill: territory.color, kind: 'territory' } });
        });
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.innerHTML = `
            <div class="legend-color" style="background: ${data.territories[0].color}"></div>
            <span>Empire Territory</span>
        `;
        legend.appendChild(legendItem);
    }

    if (data.routes) {
        data.routes.forEach(route => {
            fc.features.push({ type: 'Feature', geometry: { type: 'LineString', coordinates: route.path }, properties: { stroke: route.color, label: route.label, kind: 'route' } });
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `
                <div class="legend-color" style="background: ${route.color}"></div>
                <span>${route.label}</span>
            `;
            legend.appendChild(legendItem);
        });
    }

    if (data.cities) {
        data.cities.forEach(city => {
            fc.features.push({ type: 'Feature', geometry: { type: 'Point', coordinates: city.coords }, properties: { name: city.name, desc: city.desc, kind: 'city' } });
        });
    }

    // Helper: analyze coordinate bounds and detect common ordering mistakes
    function analyzeFeatureCollectionBounds(featureCollection) {
        let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
        let count = 0;
        function scanCoords(coords) {
            if (!coords || coords.length === 0) return;
            if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
                const lon = coords[0], lat = coords[1];
                if (!isFinite(lon) || !isFinite(lat)) return;
                minLon = Math.min(minLon, lon); maxLon = Math.max(maxLon, lon);
                minLat = Math.min(minLat, lat); maxLat = Math.max(maxLat, lat);
                count++;
                return;
            }
            coords.forEach(c => scanCoords(c));
        }
        featureCollection.features.forEach(f => {
            if (!f.geometry) return;
            const g = f.geometry;
            if (g.type === 'Point') scanCoords(g.coordinates);
            else if (g.type === 'LineString' || g.type === 'MultiPoint') scanCoords(g.coordinates);
            else if (g.type === 'Polygon' || g.type === 'MultiLineString') scanCoords(g.coordinates);
            else if (g.type === 'MultiPolygon') scanCoords(g.coordinates);
        });
        return { minLon, maxLon, minLat, maxLat, count };
    }

    // If coords appear swapped (lat outside -90..90 in second slot) try swapping all coordinate pairs
    function maybeFixSwappedCoordinates(featureCollection) {
        const stats = analyzeFeatureCollectionBounds(featureCollection);
        // If there are no coordinates, nothing to do
        if (!stats.count) return { fixed: false, stats };

        // Helper function to swap coordinate pairs recursively
        function swapCoordsArray(arr) {
            if (!arr || arr.length === 0) return;
            for (let i = 0; i < arr.length; i++) {
                if (typeof arr[i][0] === 'number' && typeof arr[i][1] === 'number') {
                    const temp = arr[i][0];
                    arr[i][0] = arr[i][1];
                    arr[i][1] = temp;
                } else if (Array.isArray(arr[i])) {
                    swapCoordsArray(arr[i]);
                }
            }
        }

        // Heuristic 1: if latitude values (index 1) exceed [-90,90], coords are likely swapped
        if (Math.abs(stats.maxLat) > 90 || Math.abs(stats.minLat) > 90) {
            console.warn('Detected latitude values outside [-90,90] — attempting to swap coordinate order. Pre-swap:', stats);
            
            featureCollection.features.forEach(f => {
                if (!f.geometry) return;
                const g = f.geometry;
                if (g.type === 'Point') {
                    const temp = g.coordinates[0];
                    g.coordinates[0] = g.coordinates[1];
                    g.coordinates[1] = temp;
                } else if (g.type === 'LineString' || g.type === 'MultiPoint') {
                    swapCoordsArray(g.coordinates);
                } else if (g.type === 'Polygon' || g.type === 'MultiLineString') {
                    swapCoordsArray(g.coordinates);
                } else if (g.type === 'MultiPolygon') {
                    swapCoordsArray(g.coordinates);
                }
            });

            const after = analyzeFeatureCollectionBounds(featureCollection);
            console.info('Post-swap stats:', after);
            return { fixed: true, stats: after };
        }
        
        // Heuristic 2: if longitude values (index 0) exceed [-180,180], coords are likely swapped
        else if (Math.abs(stats.maxLon) > 180 || Math.abs(stats.minLon) > 180) {
            console.warn('Detected longitude values outside [-180,180] — attempting to swap coordinate order. Pre-swap:', stats);
            
            featureCollection.features.forEach(f => {
                if (!f.geometry) return;
                const g = f.geometry;
                if (g.type === 'Point') {
                    const temp = g.coordinates[0];
                    g.coordinates[0] = g.coordinates[1];
                    g.coordinates[1] = temp;
                } else if (g.type === 'LineString' || g.type === 'MultiPoint') {
                    swapCoordsArray(g.coordinates);
                } else if (g.type === 'Polygon' || g.type === 'MultiLineString') {
                    swapCoordsArray(g.coordinates);
                } else if (g.type === 'MultiPolygon') {
                    swapCoordsArray(g.coordinates);
                }
            });
            
            const after = analyzeFeatureCollectionBounds(featureCollection);
            console.info('Post-swap stats:', after);
            return { fixed: true, stats: after };
        }

        // If we reach here, coordinates appear to be in valid ranges
        return { fixed: false, stats };
    }

    // Analyze and possibly fix coordinate ordering before fitting projection
    const preStats = analyzeFeatureCollectionBounds(fc);
    console.debug('FeatureCollection pre-fit stats:', preStats);
    const fixResult = maybeFixSwappedCoordinates(fc);
    if (fixResult.fixed) console.debug('Coordinates were swapped to fix ordering.', fixResult.stats);

    // Fit projection to features if possible
    try {
        projection = d3.geoMercator();
        path = d3.geoPath().projection(projection);
        if (fc.features.length > 0) {
            // Use fitExtent with proper padding for bounding box
            const padding = 40; // Consistent padding around the map
            projection.fitExtent([[padding, padding], [width - padding, height - padding]], fc);
        } else {
            // Fallback to default view if no features
            projection.center([40, 45]).scale(400).translate([width / 2, height / 2]);
        }
    } catch (e) {
        console.error('Failed to fit projection to features:', e);
        // Fallback to safe defaults
        projection = d3.geoMercator().center([40, 45]).scale(400).translate([width / 2, height / 2]);
        path = d3.geoPath().projection(projection);
    }

    // update countries with new projection
    if (window.__worldCountries) {
        countriesGroup.selectAll('path').data(window.__worldCountries).join('path').attr('class', 'country').attr('d', path);
    }

    // Draw territories (polygons)
    const territoryFeatures = fc.features.filter(f => f.properties.kind === 'territory');
    const territories = featuresGroup.selectAll('path.territory').data(territoryFeatures);
    territories.exit().remove();
    territories.enter()
        .append('path')
        .attr('class', 'territory')
        .merge(territories)
        .attr('d', path)
        .attr('fill', d => d.properties.fill || '#9b59b6')
        .attr('opacity', 0.6)
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1);

    // Draw routes (linestrings)
    const routeFeatures = fc.features.filter(f => f.properties.kind === 'route');
    const routes = featuresGroup.selectAll('path.route').data(routeFeatures);
    routes.exit().remove();
    routes.enter()
        .append('path')
        .attr('class', 'route')
        .merge(routes)
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', d => d.properties.stroke || '#ff6b6b')
        .attr('stroke-width', 3)
        .attr('opacity', 0.8)
        .attr('stroke-dasharray', '5,5')
        .attr('stroke-linecap', 'round');

    // Draw cities as groups (points)
    const cityFeatures = fc.features.filter(f => f.properties.kind === 'city');
    const citySel = featuresGroup.selectAll('g.city').data(cityFeatures);
    citySel.exit().remove();
    
    const cityEnter = citySel.enter().append('g').attr('class', 'city');
    cityEnter.append('circle')
        .attr('r', 6)
        .attr('fill', '#60a5fa')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);
    cityEnter.append('text')
        .attr('class', 'city-label')
        .attr('text-anchor', 'middle')
        .attr('dy', '-12px')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .attr('fill', 'currentColor')
        .text(d => d.properties.name);
    
    citySel.merge(cityEnter).each(function(d) {
        const centroid = path.centroid(d);
        if (centroid && isFinite(centroid[0]) && isFinite(centroid[1])) {
            d3.select(this).attr('transform', `translate(${centroid[0]},${centroid[1]})`);
        } else {
            console.warn('Invalid centroid for city:', d.properties.name, centroid);
            d3.select(this).style('display', 'none');
        }
    });

    // Attach tooltip handlers
    featuresGroup.selectAll('g.city').on('mouseover', function(event, d) {
        d3.select(this).select('circle').attr('r', 8).attr('fill', '#93c5fd');
        tooltip.style('display', 'block').html(`<strong>${d.properties.name}</strong><br>${d.properties.desc}`).style('left', (event.pageX + 10) + 'px').style('top', (event.pageY - 10) + 'px');
    }).on('mouseout', function() {
        d3.select(this).select('circle').attr('r', 6).attr('fill', '#60a5fa');
        tooltip.style('display', 'none');
    });
}

// wire buttons
document.querySelectorAll('.map-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.map-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        renderMap(this.dataset.map);
    });
});
