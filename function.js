/*eslint-env browser*/

// Get xmlrequest in order to open json file 
function getFile(url) {
  "use strict";
  var js = new XMLHttpRequest();
  js.open("GET", url, false);
  js.send();
  return js.responseText;
}

//Loading category data from json
function load() {
  var txt = "";
  var temp = "";
  var xmlhttp = getFile("prizesByYear.json");
  var parsedObj = JSON.parse(xmlhttp);
  txt += "<select id=CatSelect>";
  txt += "<option selected=selected value=all>All</option>";
  for (i in parsedObj.prizes) {
    if (temp.includes(parsedObj.prizes[i].category) === false) {
      temp += parsedObj.prizes[i].category;
      txt += "<option>" + parsedObj.prizes[i].category;
    }
  }
  txt += "</select>";
  document.getElementById("droplist").innerHTML = txt;
}

// Get the droplist select and return the value
function getCat(index) {
  var choice = document.getElementById("CatSelect");
  var cat = choice.options[choice.selectedIndex].value;
  document.getElementById("choice").innerHTML = cat;
  return cat;    
}

// On click the submit show the table
function displayTable() {
    var xmlhttp = getFile("prizesByYear.json");
    var xmlhttpID = getFile("winnersByID.json");
    var myArr = JSON.parse(xmlhttp);
    var myArrID = JSON.parse(xmlhttpID);
    displayJSON(myArr,myArrID);
    
    // Detail logic and condition to iterate and filter the table
    function displayJSON(obj,obj2){
    var nobels = obj['prizes'];
    var people = obj2['laureates'] ;
    var yearFrom = document.getElementById("from").value;
	var yearTo = document.getElementById("to").value;
    var category = getCat();

    if (isNaN(parseInt(yearFrom)) || isNaN(parseInt(yearTo))){
        alert("Please enter the year range!")
        }
    else {
        document.getElementById("genderFilter").style.display = "block";
        var row = "<table id=myTable>";
        row += "<tr>";
        row += "<th> Year </th>";
        row += "<th> Category </th>";
        row += "<th> Gender </th>";
        row += "<th> First Name </th>";
        row += "<th> Surname </th>";
        row += "<th> Movtivation </th>";
        row += "</tr>";
        document.getElementById("results").innerHTML = row + "</table>"; 
        
        var rowIndex = 0;
        var table = document.getElementById("myTable");
        
        var tr, td;
        tr = table.getElementsByTagName("tr");
        
        if (parseInt(yearFrom) > parseInt(yearTo)) {
                alert("The start year need to be equal or greater than end year."); 
        } else {
            if(parseInt(yearFrom) < 1970  || parseInt(yearTo) > 2018){
               alert("The date range available is from 1970 to 2018!");
               }
            else {
                for (var i = 0; i < nobels.length; i++) {
                    for (var j = 0; j < nobels[i].laureates.length; j++){
                        var yearValue = parseInt(nobels[i].year);
                        var categoryValue = nobels[i].category;
                        var id = nobels[i].laureates[j].id;
                        if (yearValue >= parseInt(yearFrom) && yearValue <= parseInt(yearTo) && category=='all'){
                            rowIndex += 1;
                            row = table.insertRow(-1);
                            var cell1 = row.insertCell(0);
                            var cell2 = row.insertCell(1);
                            var cell3 = row.insertCell(2);
                            var cell4 = row.insertCell(3);
                            var cell5 = row.insertCell(4);
                            var cell6 = row.insertCell(5);
                            row2 = table.insertRow(-1);
                            var cell7 = row2.insertCell(0);
                            var cell8 = row2.insertCell(1);
                            var cell9 = row2.insertCell(2);
                            var cell10 = row2.insertCell(3);
                            cell1.innerHTML = nobels[i].year;
                            cell2.innerHTML = nobels[i].category;
                            cell4.innerHTML = nobels[i].laureates[j].firstname;
                            cell5.innerHTML = nobels[i].laureates[j].surname;
                            if (!nobels[i].laureates[j].motivation){
                                var motivation = "Motivation is empty.";
                            } else {
                                var motivation =nobels[i].laureates[j].motivation;
                            }
                            cell6.innerHTML = motivation;
                            cell6.insertAdjacentHTML("afterend", "<div id='detailbtnBox'><input type='submit' id='detailBtn' value='More' onclick='moreDetail(" + rowIndex + ")'></div>");
                            row2.getElementsByTagName("td")[0].style.display = "none"
                            row2.getElementsByTagName("td")[1].style.display = "none"
                            row2.getElementsByTagName("td")[2].style.display = "none"
                            row2.getElementsByTagName("td")[3].style.display = "none"
                            row2.getElementsByTagName("td")[3].colSpan=6;
                            cell7.innerHTML = cell1.innerHTML;
                            cell8.innerHTML = cell2.innerHTML;
                            
                            cell10.id = "detailRow";
                            for (var k = 0; k < people.length; k++){
                                if (people[k].id == id){
                                cell3.innerHTML = people[k].gender;
                                cell9.innerHTML = cell3.innerHTML;
                                if (people[k].born == "0000-00-00") {
                                    var born = "-"
                                } else {
                                    var birth = people[k].born;
                                }
                                if (people[k].died == "0000-00-00") {
                                    var death = "-"
                                } else {
                                  var death = people[k].died;
                                } var bornCountry = people[k].bornCountry;
                                  var bornCity = people[k].bornCity;
                                cell10.innerHTML += 
                                "<p>Born: " + birth + "</p>" +
                                "<p>Died: " + death + "</p>" +
                                "<p>Born Country: " + bornCountry + "</p>"+
                                "<p>Born City: " + bornCity+ "</p>";
                                for (var l=0; l<people[k].prizes.length; l++){
                                    var awardYear = people[k].prizes[l].year;
                                    var awardCat = people[k].prizes[l].category;
                                    cell10.innerHTML +=
                                        "<p>Prize Year: " + awardYear + "</p>" +
                                        "<p>Prize Category: " + awardCat + "</p>";
                                    if (!people[k].prizes[l].affiliations){
                                        var aff_name = "affiliations is empty.";
                                        var city = "affiliations is empty."
                                        var country = "affiliations is empty."
                                    } else { 
                                        for (var m=0;           m<people[k].prizes[l].affiliations.length; m++){
                                        var aff_name = people[k].prizes[l].affiliations[m].name;
                                        var aff_city = people[k].prizes[l].affiliations[m].city;
                                        var aff_country = people[k].prizes[l].affiliations[m].country;
                                        cell10.innerHTML +=
                                        "<p>Affiliation Name: " + aff_name + "</p>" +
                                        "<p>Affiliation City: " + aff_city + "</p>" +
                                        "<p>Affiliation Country: " + aff_country + "</p>";
                             }
                        }
                    }
                }
            }
                        } else if (yearValue >= parseInt(yearFrom)&& yearValue <= parseInt(yearTo) && categoryValue==category){
                            rowIndex += 1;
                            console.log(cell1);
                            row = table.insertRow(-1);
                            var cell1 = row.insertCell(0);
                            var cell2 = row.insertCell(1);
                            var cell3 = row.insertCell(2);
                            var cell4 = row.insertCell(3);
                            var cell5 = row.insertCell(4);
                            var cell6 = row.insertCell(5);
                            row2 = table.insertRow(-1);
                            var cell7 = row2.insertCell(0);
                            var cell8 = row2.insertCell(1);
                            var cell9 = row2.insertCell(2);
                            var cell10 = row2.insertCell(3);
                            cell1.innerHTML = nobels[i].year;
                            cell2.innerHTML = nobels[i].category;
                            cell4.innerHTML = nobels[i].laureates[j].firstname;
                            cell5.innerHTML = nobels[i].laureates[j].surname;
                            if (!nobels[i].laureates[j].motivation){
                                var motivation = "Motivation is empty.";
                            } else {
                                var motivation =nobels[i].laureates[j].motivation;
                            }
                            cell6.innerHTML = motivation;
                            cell6.insertAdjacentHTML("afterend", "<div id='detailbtnBox'><input type='submit' id='detailBtn' value='More' onclick='moreDetail(" + rowIndex + ")'></div>");
                            row2.getElementsByTagName("td")[0].style.display = "none"
                            row2.getElementsByTagName("td")[1].style.display = "none"
                            row2.getElementsByTagName("td")[2].style.display = "none"
                            row2.getElementsByTagName("td")[3].style.display = "none"
                            row2.getElementsByTagName("td")[3].colSpan=6;
                            cell7.innerHTML = cell1.innerHTML;
                            cell8.innerHTML = cell2.innerHTML;
                            cell10.id = "detailRow";

                            for (var k = 0; k < people.length; k++){
                                if (people[k].id == id){
                                cell3.innerHTML = people[k].gender;
                                cell9.innerHTML = cell3.innerHTML;
                                if (people[k].born == "0000-00-00") {
                                    var born = "-"
                                } else {
                                    var birth = people[k].born;
                                }
                                if (people[k].died == "0000-00-00") {
                                    var death = "-"
                                } else {
                                  var death = people[k].died;
                                } var bornCountry = people[k].bornCountry;
                                  var bornCity = people[k].bornCity;
                                cell10.innerHTML += 
                                "<p>Born: " + birth + "</p>" +
                                "<p>Died: " + death + "</p>" +
                                "<p>Born Country: " + bornCountry + "</p>"+
                                "<p>Born City: " + bornCity+ "</p>";
                                for (var l=0; l<people[k].prizes.length; l++){
                                    var awardYear = people[k].prizes[l].year;
                                    var awardCat = people[k].prizes[l].category;
                                    cell10.innerHTML +=
                                        "<p>Prize Year: " + awardYear + "</p>" +
                                        "<p>Prize Category: " + awardCat + "</p>";
                                    if (!people[k].prizes[l].affiliations){
                                        var aff_name = "affiliations is empty.";
                                        var city = "affiliations is empty."
                                        var country = "affiliations is empty."
                                    } else { 
                                        for (var m=0;           m<people[k].prizes[l].affiliations.length; m++){
                                        var aff_name = people[k].prizes[l].affiliations[m].name;
                                        var aff_city = people[k].prizes[l].affiliations[m].city;
                                        var aff_country = people[k].prizes[l].affiliations[m].country;
                                        cell10.innerHTML +=
                                        "<p>Affiliation Name: " + aff_name + "</p>" +
                                        "<p>Affiliation City: " + aff_city + "</p>" +
                                        "<p>Affiliation Country: " + aff_country + "</p>";
                             }
                        }
                    }
                }
            }
                        } 
            }
        }
        
		}
	}
}

// Select the gender by changing radio button
genderSel=function() {
      var table, tr, td;
      table = document.getElementById("myTable");
      tr = table.getElementsByTagName("tr");
      var genderSel = document.querySelectorAll("input[name=gender]:checked")[0].value
      console.log(genderSel);
      for (var i = 0; i < tr.length; i++){
          tdGend = tr[i].getElementsByTagName("td")[2];
              if (tdGend){
                  tdGender = tdGend.innerText; 
                      if (genderSel=="male" && tdGender == "male"){
                          tr[i].style.display = "";
                    } else if (genderSel=="female" && tdGender == "female"){
                          tr[i].style.display = "";
                    } else if (genderSel == "both"){
                          tr[i].style.display = "";
                    } else {
                          tr[i].style.display = "none";
                    }
                }
            }	
}        
        
  } 

moreDetail=function(rowIndex) {
//         console.log(rowIndex);
        var table, tr, td, detail;
        table = document.getElementById("myTable");
        tr = table.getElementsByTagName("tr");
        detail = tr[rowIndex*2].getElementsByTagName("td")[3];
        if (detail.style.display === ""){
            detail.style.display = "none";
        } else { 
            detail.style.display = "";
          }
       }  
    }


    