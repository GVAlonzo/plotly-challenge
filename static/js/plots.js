// Inspired by Dom's office hours on 12/11/21

function drawBarChart(sampleID){

    d3.json("samples.json").then(data => {

        let samples = data.samples;
        let resultArray = samples.filter(s => s.id == sampleID);
        let result = resultArray[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;
        let yticks = otu_ids.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();

        let barData = {
            x: sample_values.slice(0,10).reverse(),
            y: yticks,
            type: "bar",
            text: otu_labels.slice(0,10).reverse(),
            orientation: "h"
        };

        let barArray = [barData];

        let barLayout = {
            title: "Top 10 Bateria Cultures Found",
            margin: {t: 30, l: 150},
            width: 500
        }

        Plotly.newPlot("bar", barArray, barLayout);
    });
}

function drawBubbleChart(sampleID){

    d3.json("samples.json").then(data => {

        // console.log("DATA");
        // console.log(data);

        let samples = data.samples;
        let resultArray = samples.filter(s => s.id == sampleID);
        let result = resultArray[0];

        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let sample_values = result.sample_values;
        let yticks = otu_ids.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();

        // console.log("sample_values");
        // console.log(sample_values);

        let bubbleData = {
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Hot"
            }
        };

        let bubbleArray = [bubbleData];

        let bubbleLayout = {
            title: "Bacteria Cultures per Sample",
            margin: {t: 0},
            xaxis: {title: "OTU ID"},
            showlegend: false,
            height: 500,
            margin: {t: 30},
            width: 1000
        }

        Plotly.newPlot("bubble", bubbleArray, bubbleLayout);
    });
}


function drawGaugeChart(sampleID){

     d3.json("samples.json").then(data => {

        let metadata = data.metadata;
        let resultArray = metadata.filter(s => s.id == sampleID);
        let result = resultArray[0];
        let washFreq = result.wfreq;

        let gaugeData = {
            value: washFreq,
            type: "indicator",
            mode: "gauge+number",
            title: { text: "Scrubs Per Week"},
            gauge:{
                axis: {range: [null, 9] }
            }
        };        

        let gaugeArray = [gaugeData];

        let gaugeLayout = {
            title: "Belly Button Washing Frequency",
            margin: {t: 30, l: 150},
            width: 500
        }

        Plotly.newPlot("gauge", gaugeArray, gaugeLayout);
    });
}



function displayDemoData(sampleID){
    console.log(`Displaying Demographics For: (${sampleID})`);

    d3.json("samples.json").then(data => {

        console.log("DATA");
        console.log(data);

        let samples = data.samples;
        let resultArray = samples.filter(s => s.id == sampleID);
        let result = resultArray[0]
    });

}

function optionChanged(selectedValue){
    console.log(`Selected Value: (${selectedValue})`);

    // Display bar chart
    drawBarChart(selectedValue);
    // Display gauge chart
    drawGaugeChart(selectedValue);    
    // Display the bubble chart
    drawBubbleChart(selectedValue);
    // Populate demographic info
    displayDemoData(selectedValue);
}

function InitDashboard(){

    let selector = d3.select("#selDataset");

    d3.json("samples.json").then(data => {

        let sampleNames = data.names;

        sampleNames.forEach(sampleId => {
            selector.append("option")
                .text(sampleId)
                .property("value",sampleId);
        });

        // Grab first Test Subject ID in JSON dataset for initial load
        let sampleID = sampleNames[0];
        // Draw charts for initial load
        drawBarChart(sampleID);
        drawGaugeChart(sampleID);
        drawBubbleChart(sampleID);
        displayDemoData(sampleID);
    });
}

InitDashboard();