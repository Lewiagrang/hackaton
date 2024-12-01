



svgElements.push(
    { type: 'text', content: data[2][1],  height: svgHeight / 20}, // number
    { type: 'text', content: data[3][1],  height: svgHeight / 6}, // model
    { type: 'text', content: data[4][1],  height: svgHeight / 6}, // name
    { type: 'text', content: data[5][1],  height: svgHeight / 20}, // price-in-rubles
    { type: 'text', content: data[6][1],  height: svgHeight / 6}, // price
    // Grouping elements to occupy 1/4 of the height
    { type: 'group', height: svgHeight / 4, content: [
        { type: 'text', content: data[7][1]}, // composition
        { type: 'text', content: data[8][1]}, // mrt-country
        { type: 'text', content: data[9][1]}, // date-of-manufacture
        { type: 'text', content: data[10][1]}, // GOST
        { type: 'text', content: data[11][1]}, // importer
        { type: 'text', content: data[12][1]}, // mrt
        { type: 'text', content: data[13][1]}, // producer
        { type: 'text', content: data[14][1]}  // producer-address
    ]},
    // Grouping elements to occupy 1/5 of the height
    { type: 'group', height: svgHeight / 5, content: [
        { type: 'text', content: data[15][1]}, // ru-size
        { type: 'text', content: data[16][1]}, // mrt-size
        { type: 'text', content: data[17][1]}  // EAN-13
    ]}
);
