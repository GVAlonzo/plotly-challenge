// Inspired by Dom's office hours on 12/11/21



// *****************************************************************
// **
// ** Function for BAR CHART
// **
// *****************************************************************

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
            margin: {t: 30, l: 150}
            // width: 700
        }

        Plotly.newPlot("bar", barArray, barLayout);
    });
}




// *****************************************************************
// **
// ** Function for GAUGE CHART
// **
// *****************************************************************
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
                axis: {range: [null, 9] },
                bar: { color: "black" },
                steps: [
                    { range: [0, 1], color: "rgb(255, 255, 255)" },
                    { range: [1, 2], color: "rgb(211, 232, 211)" },
                    { range: [2, 3], color: "rgb(167, 209, 167)" },
                    { range: [3, 4], color: "rgb(167, 209, 167)" },
                    { range: [4, 5], color: "rgb(122, 185, 122)" },
                    { range: [5, 6], color: "rgb(122, 185, 122)" },
                    { range: [6, 7], color: "rgb(78, 162, 78)" },
                    { range: [7, 8], color: "rgb(78, 162, 78)" },
                    { range: [8, 9], color: "rgb(34, 139, 34)" }
                ],
            }
        };        

        let gaugeArray = [gaugeData];

        let gaugeLayout = {
            title: "Belly Button Washing Frequency",
            margin: {t: 30, l: 150}
            // width: 500
            // paper_bgcolor: "lightgray",
        }

        Plotly.newPlot("gauge", gaugeArray, gaugeLayout);
    });
}


// *****************************************************************
// **
// ** Function for DEMOGRAPHICS DATA
// **
// *****************************************************************
function displayDemoData(sampleID){
    console.log(`Displaying Demographics For: (${sampleID})`);

    var metaArray = [];

    d3.json("samples.json").then(data => {

        let metadata = data.metadata;
        let resultArray = metadata.filter(s => s.id == sampleID);
        let result = resultArray[0]

        // FOR LOOP TO APPEND / WRITE DATA
        var d3Select = d3.select("#sample-metadata");
    
        Object.entries(result).forEach(([k,v]) => {
            console.log("IN LOOP")
            d3Select.append("p")
                    .text(`${k}: ${v}`)
        });


        // \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ \/ 
        // THE CODE BELOW WORKS, BUT WAS SIMPLIFIED IN OFFICE
        //      HOURS WITH TA ERIN
        //
        // metaArray.push("ID: " + sampleID);
        // metaArray.push("AGE: " + result.age);
        // metaArray.push("BB TYPE: " + result.bbtype);
        // metaArray.push("ETHNICITY: " + result.ethnicity);
        // metaArray.push("GENDER: " + result.gender);
        // metaArray.push("LOCATION: " + result.location);
        // metaArray.push("WFREQ: " + result.wfreq);
        //
        // metaArray.forEach((k) => {
        //     d3Select.append("p")
        //             .text(k)
        // });
        // 
        // /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ /\ 
    });

   

    console.log("META ARRAY #3");
    console.log(metaArray);

    //  AREA IN HTML TO UPDATE/APPEND
    // <div class="panel panel-primary">
    //   <div class="panel-heading">
    //     <h3 class="panel-title">Demographic Info</h3>
    //    </div>
    //    <div id="sample-metadata" class="panel-body"></div>
    // </div>

}


// *****************************************************************
// **
// ** Function for BUBBLE CHART
// **
// *****************************************************************

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
            margin: {t: 30}
            // width: 1000
        }

        Plotly.newPlot("bubble", bubbleArray, bubbleLayout);
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