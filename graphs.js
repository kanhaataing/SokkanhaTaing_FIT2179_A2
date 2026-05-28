const choroplethSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "title": "",
        background: "transparent",
        "width": "container",
        "height": 800,
        "projection": {"type": "mercator"},
        "layer": [
            {
                "data": {
                    "url": "australia-states.json",
                    "format": {"type": "json", "property": "features"}
                },
                "transform": [{
                    "lookup": "properties.STATE_NAME",
                    "from": {
                        "data": {"url": "threat_by_state.csv"},
                        "key": "state",
                        "fields": ["threatCount"]
                    }
                }],
                "mark": {"type": "geoshape", "stroke": "white", "strokeWidth": 1},
                "encoding": {
                    "color": {
                        "field": "threatCount",
                        "type": "quantitative",
                        "scale": {"scheme": "reds"},
                        "legend": {"title": "Threatened Species",
                            "orient": "bottom"
                        }
                    },
                    "tooltip": [
                        {"field": "properties.STATE_NAME", "type": "nominal", "title": "State"},
                        {"field": "threatCount", "type": "quantitative", "title": "Threatened Species"}
                    ]
                }
            },
            {
                "data": {
                    "values": [
                        {"state": "NSW", "lat": -32.5, "lon": 146.5},
                        {"state": "VIC", "lat": -37.0, "lon": 144.0},
                        {"state": "QLD", "lat": -22.0, "lon": 144.0},
                        {"state": "SA", "lat": -30.0, "lon": 135.0},
                        {"state": "WA", "lat": -25.0, "lon": 121.0},
                        {"state": "TAS", "lat": -42.0, "lon": 146.5},
                        {"state": "NT", "lat": -19.0, "lon": 133.0},
                        {"state": "ACT", "lat": -35.5, "lon": 149.0}
                    ]
                },
                "mark": {"type": "text", "fontSize": 10, "fontWeight": "bold", "fill": "white"},
                "encoding": {
                    "longitude": {"field": "lon", "type": "quantitative"},
                    "latitude": {"field": "lat", "type": "quantitative"},
                    "text": {"field": "state", "type": "nominal"}
                }
            }
        ]
    };

        vegaEmbed('#choropleth_chartOne', choroplethSpec, {
            "actions": false,
            "renderer": "svg"
        });

const waffleSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "title": "",
    "background": "transparent",
    "width": 750,
    "height": 500,
    "data": {"url": "waffle_data.csv"},
    "mark": {"type": "rect", "stroke": "white", "strokeWidth": 2},
    "encoding": {
        "x": {
            "field": "x",
            "type": "ordinal",
            "axis": null
        },
        "y": {
            "field": "y",
            "type": "ordinal",
            "axis": null,
            "sort": "ascending"
        },
        "color": {
            "field": "threatLevel",
            "type": "nominal",
            "scale": {
                "domain": ["Vulnerable", "Endangered", "Critically Endangered", "Extinct"],
                "range": ["#fece79", "#b14a36", "#8c0902", "#210100"]
            },
            "legend": {
                "title": "Threat Level",
                "orient": "bottom"}
        },
        "tooltip": [
            {"field": "threatLevel", "type": "nominal", "title": "Threat Level"}
        ]
    }
};

vegaEmbed('#waffle_chartTwo', waffleSpec);

const barChartSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "title": "",
    "background": "transparent",
    "width": 400,
    "height": 300,
    "data": {"url": "taxon_group_counts.csv"},
    "mark": {"type": "bar", "cornerRadiusEnd": 4},
    "encoding": {
        "y": {
            "field": "taxonGroup",
            "type": "nominal",
            "sort": "-x",
            "title": null,
            "axis": {"labelFontSize": 13}
        },
        "x": {
            "field": "count",
            "type": "quantitative",
            "title": "Number of Threatened Species"
        },
        "color": {
            "field": "taxonGroup",
            "type": "nominal",
            "scale": {
                "domain": ["birds", "mammals", "reptiles", "ray-finned fishes", "frogs", "crabs, lobsters, shrimps, woodlice", "insects", "sharks"],
                "range": ["#7fc7cc", "#af5031", "#4b5b34", "#092f33", "#ea8913", "#e9c46a", "#fdaba5", "#980204"]
            },
            "legend": null
        },
        "tooltip": [
            {"field": "taxonGroup", "type": "nominal", "title": "Group"},
            {"field": "count", "type": "quantitative", "title": "Threatened Species"}
        ]
    }
};

vegaEmbed('#bargraph_chartThree', barChartSpec);


const dotMapSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "title": "",
    "background": "transparent",
    "width": 1500,
    "height": 1000,
    "projection": {"type": "mercator"},
    "layer": [
        {
            "data": {
                "url": "australia-states.json",
                "format": {"type": "json", "property": "features"}
            },
            "mark": {
                "type": "geoshape",
                "fill": "#e8e8e8",
                "stroke": "white",
                "strokeWidth": 1
            }
        },
        {
            "data": {"url": "dot_map.csv"},
            "mark": {
                "type": "circle",
                "opacity": 0.6,
                "size": 100
            },
            "encoding": {
                "longitude": {"field": "longitude", "type": "quantitative"},
                "latitude": {"field": "latitude", "type": "quantitative"},
                "color": {
                    "field": "taxonomicGroup",
                    "type": "nominal",
                    "scale": {
                        "domain": ["Birds", "Mammals", "Amphibians", "Plants"],
                        "range": ["#084463", "#8c0902", "#e6a341", "#628b33"]
                    },
                    "legend": {
                        "title": "Taxonomic Group",
                        "orient": "bottom"
                    }
                },
                "tooltip": [
                    {"field": "taxonomicGroup", "type": "nominal", "title": "Group"},
                    {"field": "epbcStatus", "type": "nominal", "title": "Status"},
                    {"field": "latitude", "type": "quantitative", "title": "Latitude"},
                    {"field": "longitude", "type": "quantitative", "title": "Longitude"}
                ]
            }
        }
    ]
};

vegaEmbed('#dotmap_chartSix', dotMapSpec);

function makeAreaSpec(group) {
    return {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "title": group,
        "background": "transparent",
        "width": "container",
        "height": 200,
        "data": {"url": "listing_trends.csv"},
        "transform": [{"filter": `datum.taxonGroup === '${group}'`}],
        "mark": {"type": "area", "opacity": 0.8},
        "encoding": {
            "x": {
                "field": "year",
                "type": "quantitative",
                "title": "Year",
                "axis": {"format": "d", "labelAngle": -30, "tickCount": 5}
            },
            "y": {
                "field": "cumulative",
                "type": "quantitative",
                "title": "Species",
                "stack": true
            },
            "color": {
                "field": "threatLevel",
                "type": "nominal",
                "scale": {
                    "domain": ["Vulnerable", "Endangered", "Critically Endangered"],
                    "range": ["#fece79", "#b14a36", "#590202"]
                },
                "legend": null
            },
            "tooltip": [
                {"field": "year", "type": "quantitative", "title": "Year"},
                {"field": "threatLevel", "type": "nominal", "title": "Threat Level"},
                {"field": "cumulative", "type": "quantitative", "title": "Total Species"}
            ]
        }
    };
}

vegaEmbed('#area_birds', makeAreaSpec('birds'));
vegaEmbed('#area_mammals', makeAreaSpec('mammals'));
vegaEmbed('#area_rayfinned', makeAreaSpec('ray-finned fishes'));
vegaEmbed('#area_reptiles', makeAreaSpec('reptiles'));

//strip plot for top threat cases and proportion affected
const lollipopSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "title": "",
    "background": "transparent",
    "width": 600,
    "height": 400,
    "data": {"url": "soe2016biopressures-affecting-epbc-listed-species.csv"},
    "transform": [
        {"filter": "datum['Threat'] !== 'Uncategorised/other' && datum['Threat'] !== 'Protected status'"}
    ],
    "layer": [
        {
            "mark": {"type": "rule", "color": "#c1121f", "strokeWidth": 2},
            "encoding": {
                "y": {"field": "Threat", "type": "nominal", "sort": "-x", "title": null},
                "x": {"field": "Proportion of EPBC listed species (%)", "type": "quantitative", "title": "% of Species Affected"},
                "x2": {"value": 0}
            }
        },
        {
            "mark": {"type": "point", "filled": true, "size": 100, "color": "#c1121f"},
            "encoding": {
                "y": {"field": "Threat", "type": "nominal", "sort": "-x"},
                "x": {"field": "Proportion of EPBC listed species (%)", "type": "quantitative"},
                "tooltip": [
                    {"field": "Threat", "type": "nominal", "title": "Threat"},
                    {"field": "Proportion of EPBC listed species (%)", "type": "quantitative", "title": "% Affected"}
                ]
            }
        }
    ]
};

vegaEmbed('#lollipop_chartSeven', lollipopSpec);

function drawCombinedChart(environment) {
    const filterExpr = environment === 'both' 
        ? "true" 
        : `datum.environment === '${environment}'`;

    const spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "title": "",
        "background": "transparent",
        "width": 600,
        "height": 400,
        "data": {"url": "combined_introduced.csv"},
        "transform": [
            {"filter": filterExpr}
        ],
        "mark": {"type": "line", "point": true, "interpolate": "monotone"},
        "encoding": {
            "x": {
                "field": "yearStart",
                "type": "quantitative",
                "title": "Year",
                "axis": {"format": "d"}
            },
            "y": {
                "field": "pct_growth",
                "type": "quantitative",
                "title": "% Growth since 1971"
            },
            "color": {
                "field": "category",
                "type": "nominal",
                "scale": {
                    "domain": ["Terrestrial - Introduced", "Terrestrial - Invasive", "Marine - Introduced", "Marine - Invasive"],
                    "range": ["#4b5b34", "#a7c957", "#4a90d9", "#1d3557"]
                },
                "legend": {"title": "Category"}
            },
            "tooltip": [
                {"field": "yearStart", "type": "quantitative", "title": "Year"},
                {"field": "category", "type": "nominal", "title": "Category"},
                {"field": "pct_growth", "type": "quantitative", "title": "% Growth", "format": ".1f"},
                {"field": "speciesCount", "type": "quantitative", "title": "Species Count"}
            ]
        }
    };

    vegaEmbed('#terrestrial_chartEight', spec);
}

drawCombinedChart('both');

function updateChart(environment) {

    document.querySelectorAll('.filter_btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    drawCombinedChart(environment);
}