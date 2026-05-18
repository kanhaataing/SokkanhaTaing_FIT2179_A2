const choroplethSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "title": "Threatened Species by State",
        background: "transparent",
        "width": 600,
        "height": 500,
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
                        "legend": {"title": "Threatened Species"}
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

        vegaEmbed('#choropleth_chartOne', choroplethSpec);

const waffleSpec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "title": "Proportion of Species by Threat Level",
    "background": "transparent",
    "width": 300,
    "height": 300,
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
            "axis": null
        },
        "color": {
            "field": "threatLevel",
            "type": "nominal",
            "scale": {
                "domain": ["Vulnerable", "Endangered", "Critically Endangered", "Extinct"],
                "range": ["#f4a261", "#e76f51", "#c1121f", "#370617"]
            },
            "legend": {"title": "Threat Level"}
        },
        "tooltip": [
            {"field": "threatLevel", "type": "nominal", "title": "Threat Level"}
        ]
    }
};

vegaEmbed('#waffle_chartTwo', waffleSpec);