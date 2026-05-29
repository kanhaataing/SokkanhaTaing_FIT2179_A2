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
    "width": "container",
    "height": 400,
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

vegaEmbed('#waffle_chartTwo', waffleSpec, {
    "actions": false,
    "renderer": "svg"
});

const barChartSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "title": "",
    "background": "transparent",
    "width": "container",
    "height": 350,
    "data": {"url": "taxon_group_counts.csv"},
    "mark": {"type": "bar", "cornerRadiusEnd": 2},
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
                "domain": ["birds", "mammals", "reptiles", "ray-finned fishes", "frogs", "Crustaceans", "insects", "sharks"],
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

vegaEmbed('#bargraph_chartThree', barChartSpec, {"actions": false});


function makeAreaSpec(group, threatFilter = null) {
    const transforms = [
        {"filter": `datum.taxonGroup === '${group}'`}
    ];
    if (threatFilter) {
        transforms.push({"filter": `datum.threatLevel === '${threatFilter}'`});
    }

    return {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "title": group,
        "background": "transparent",
        "width": "container",
        "height": 200,
        "data": {"url": "listing_trends.csv"},
        "transform": transforms,
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

function embedAllCharts(threatFilter = null) {
    vegaEmbed('#area_birds', makeAreaSpec('birds', threatFilter));
    vegaEmbed('#area_mammals', makeAreaSpec('mammals', threatFilter));
    vegaEmbed('#area_rayfinned', makeAreaSpec('ray-finned fishes', threatFilter));
    vegaEmbed('#area_reptiles', makeAreaSpec('reptiles', threatFilter));
}


embedAllCharts();

let activeFilter = null;

document.querySelectorAll('.legend_item').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
        const threat = item.querySelector('span').textContent.trim();

        activeFilter = activeFilter === threat ? null : threat;

        embedAllCharts(activeFilter);

        document.querySelectorAll('.legend_item').forEach(el => {
            const label = el.querySelector('span').textContent.trim();
            el.style.opacity = (!activeFilter || label === activeFilter) ? '1' : '0.3';
        });
    });
});

//lollipop plot for top threat cases and proportion affected
const lollipopSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "title": "",
    "background": "transparent",
    "width": "container",
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

vegaEmbed('#lollipop_chartEight', lollipopSpec);

function drawCombinedChart(environment) {
    const filterExpr = environment === 'both' 
        ? "true" 
        : `datum.environment === '${environment}'`;

    const spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "title": "",
        "background": "transparent",
        "width": "container",
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
                "legend": {"title": "Category", 
                    "orient": "bottom"
                }
            },
            "tooltip": [
                {"field": "yearStart", "type": "quantitative", "title": "Year"},
                {"field": "category", "type": "nominal", "title": "Category"},
                {"field": "pct_growth", "type": "quantitative", "title": "% Growth", "format": ".1f"},
                {"field": "speciesCount", "type": "quantitative", "title": "Species Count"}
            ]
        }
    };

    vegaEmbed('#line_chartNine', spec, {
        "actions": false,
        "renderer": "svg"
    });
}

drawCombinedChart('both');

function updateChart(environment) {

    document.querySelectorAll('.filter_btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    drawCombinedChart(environment);
}

const divergingbarSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "title": "",
    "background": "transparent",
    "width": "container",
    "height": 400,
    "data": {"url": "protection_stacked.csv"},
    "transform": [
        {
            "calculate": "datum.type === 'Unprotected' ? -datum.rate : datum.rate",
            "as": "divergingRate"
        }
    ],
    "layer": [
        {
            "mark": {"type": "bar", "cornerRadiusEnd": 2},
            "encoding": {
                "x": {
                    "field": "divergingRate",
                    "type": "quantitative",
                    "title": "← Unprotected | Protected →",
                    "axis": {"format": ".0f", "labelExpr": "abs(datum.value)"}
                },
                "y": {
                    "field": "epbcStatus",
                    "type": "nominal",
                    "title": null,
                    "sort": ["Vulnerable", "Endangered", "Critically Endangered", "Extinct"],
                    "scale": {"paddingInner": 0.3}
                },
                "color": {
                    "field": "type",
                    "type": "nominal",
                    "scale": {
                        "domain": ["Indigenous Protected", "Non-Indigenous Protected", "Unprotected"],
                        "range": ["#4b5b34", "#a7c957", "#c1121f"]
                    },
                    "legend": {"title": "Protection Type", 
                        "orient": "bottom"
                    }
                },
                "tooltip": [
                    {"field": "epbcStatus", "type": "nominal", "title": "Threat Level"},
                    {"field": "type", "type": "nominal", "title": "Protection Type"},
                    {"field": "rate", "type": "quantitative", "title": "Proportion (%)", "format": ".2f"}
                ]
            }
        },
        {
            "mark": {"type": "rule", "color": "#403931", "strokeWidth": 1.5},
            "encoding": {"x": {"datum": 0}}
        }
    ]
};
vegaEmbed('#divergingbar_chartTen', divergingbarSpec, {
    "actions": false,
    "renderer": "svg"
});

const bivarMapSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "title": "",
    "background": "transparent",
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
                    "data": {"url": "state_protection.csv"},
                    "key": "state",
                    "fields": ["avgProtectionRate", "totalSpecies"]
                }
            }],
            "mark": {"type": "geoshape", "stroke": "white", "strokeWidth": 1},
            "encoding": {
                "color": {
                    "field": "avgProtectionRate",
                    "type": "quantitative",
                    "scale": {"scheme": "greens"},
                    "legend": {"title": "Avg Protection Rate (%)",
                        "orient": "top-right",
                        "direction": "vertical",
                    }
                },
                "tooltip": [
                    {"field": "properties.STATE_NAME", "type": "nominal", "title": "State"},
                    {"field": "avgProtectionRate", "type": "quantitative", "title": "Avg Protection Rate (%)", "format": ".1f"},
                    {"field": "totalSpecies", "type": "quantitative", "title": "Total Threatened Species"}
                ]
            }
        },
        {
    "data": {
        "values": [
            {"state": "New South Wales", "lat": -32.5, "lon": 146.5, "totalSpecies": 1602, "avgProtectionRate": 29.73},
            {"state": "Victoria", "lat": -37.0, "lon": 144.0, "totalSpecies": 439, "avgProtectionRate": 17.59},
            {"state": "Queensland", "lat": -22.0, "lon": 144.0, "totalSpecies": 999, "avgProtectionRate": 38.92},
            {"state": "South Australia", "lat": -30.0, "lon": 135.0, "totalSpecies": 443, "avgProtectionRate": 29.27},
            {"state": "Western Australia", "lat": -25.0, "lon": 121.0, "totalSpecies": 817, "avgProtectionRate": 41.56},
            {"state": "Tasmania", "lat": -42.0, "lon": 146.5, "totalSpecies": 485, "avgProtectionRate": 46.31},
            {"state": "Northern Territory", "lat": -19.0, "lon": 133.0, "totalSpecies": 247, "avgProtectionRate": 40.76}
        ]
    },
    "mark": {"type": "circle", "opacity": 0.6, "color": "#c1121f"},
    "encoding": {
        "longitude": {"field": "lon", "type": "quantitative"},
        "latitude": {"field": "lat", "type": "quantitative"},
        "size": {
            "field": "totalSpecies",
            "type": "quantitative",
            "scale": {"range": [100, 3000]},
            "legend": {"title": "Threatened Species",
                "orient": "top-right",
                "direction": "vertical",
            }
        },
        "tooltip": [
            {"field": "state", "type": "nominal", "title": "State"},
            {"field": "avgProtectionRate", "type": "quantitative", "title": "Protection Rate (%)", "format": ".1f"},
            {"field": "totalSpecies", "type": "quantitative", "title": "Threatened Species"}
        ]
    }
}
    ]
};

vegaEmbed('#bivarMap_chartEleven', bivarMapSpec);