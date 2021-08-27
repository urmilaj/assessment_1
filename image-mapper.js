function imageMapper() {

    //empty data string
    let data = [];

    //select div to create input for user to annotate image
    const userDialog = d3.select(".annotation");
    
    //create an event listener to hear for changes in the image upload
    d3.select("#imageFile").on("change", function(event){
        
        //select the uploaded image
        const img = d3.select("img");

        //event listener on user click
        img.on("click",userInput);

        //create function for userInput
        function userInput(event){

            //use d3.pointer to collect user click
            const clickPoint = d3.pointer(event)
            
            //holds to x and y points of user click
            let xPos = clickPoint[0],
                yPos = clickPoint[1];

            //input box position
            userDialog.style("left",`${event.pageX-50}px`)
            .style("top",`${event.pageY-5}px`)
            .style("display","block");

            //create the input with submit button
            userDialog.html("<div><form><input type='text' id='annotate'><button type='submit' value='save'>Save</button></form></div>");
                
            //event listener when user clicks submit
            userDialog.on("submit", function(event){

                //get the annotations the user entered
                let description = event.path[0][0].value;

                //create an array of values to make table
                let values = [xPos, yPos, description];

                //push the values to the empty data string created earlier
                data.push(values);

                //annotation table heading
                const tableHeader = ["X Pos", "Y Pos", "Descripton"];

                //annotation table styling
                const table = d3.select(".imageAnnotations")
                    .style("background-color","#F3F1F5")
                    .style("border-collapse","collapse");
                
                //use d3 to create table header
                const tableTitle = table.selectAll("th")
                    .data(tableHeader)
                    .join("th")
                    .style("padding","3px")
                    .style("border","1px solid black")
                    .text(d=>d);

                //use d3 to create table rows to hold annotations
                const tableDetails = table.selectAll("tr")
                    .data(data)
                    .join("tr")
                    .selectAll("td")
                    .data(d=>d)
                    .join("td")
                    .style("padding","3px")
                    .style("border","1px solid black")
                    .text(d=>d);
                    
                //prevents page from reloading
                event.preventDefault();
            })
         }

    })
}

//create image upload function to parse image
function imageUpload() {
    //select the html img tag
    const image = document.querySelector('img');
    
    //the name of the image that has been uploaded by user
    const imageFile = document.querySelector('input[type=file]').files[0];

    //use FileReader api to parse image
    const reader = new FileReader();

    reader.readAsDataURL(imageFile);
    
    reader.onload = function() {

        image.src = reader.result;

        //create a function to display image details after user has uploaded it.
        image.onload = function() {

            //collect image details to make table.
            const imageWidth = this.width,
            imageHeight = this.height,
            imageDimensions = [imageWidth, imageHeight],
            imageName = imageFile.name,
            imageType = imageFile.type;
            
            
            const imageData = [{imageName, imageType, imageDimensions}];

            const imageTable = d3.select(".imageInfo")
                .style("background-color","#F3F1F5");

            //create the table using d3
            const imageInfo = imageTable.selectAll("tr")
                .data(imageData)
                .enter()
                    
            imageInfo.append("tr")
                .text(d=>"Image Name: "+d.imageName);

            imageInfo.append("tr")
                .text(d => "Dimensions: "+d.imageDimensions[0]+" x "+d.imageDimensions[1]);

            imageInfo.append("tr")
                .text(d=>"MIME Type: "+d.imageType);

            imageMapper();

                }
            }

}