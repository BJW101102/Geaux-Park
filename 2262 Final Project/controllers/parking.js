/*
Name: Brandon Walton
Prof: Krishna Vadrevu
Class: CSC-2610
Date: 12/3/2023
*/

var script = document.createElement('script');
var ticket_count = 0;

function reserveLot(button) {

   const name = button.closest('tr').querySelector('td:nth-child(1)').innerText;
   const lotId = getLotID(name)
   const startTime = window.prompt('Enter start time (HH:mm):');
   const endTime = window.prompt('Enter end time (HH:mm):');
   const ticket = generateTicketID();

   const reservationData = {
      name,
      lotId,
      ticket,
      startTime,
      endTime,
   };

   //Making Post request
   fetch('/reserveLot', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationData),
   })
      .then(response => response.json())
      .then(data => {
         console.log('Reservation successful:', data);

         // Example: Update the client-side table
         const reservedTable = document.getElementById('reserved-table');

         // Check if "No parking lot data available" row exists and remove it
         const noDataRow = reservedTable.querySelector('td[colspan="4"]');
         if (noDataRow) {
            noDataRow.closest('tr').remove();
         }

         // Append the new reservation row
         const newRow = document.createElement('tr');
         newRow.innerHTML = `<td>${data.lotname}</td><td>${data.id}</td><td>${data.startTime}</td><td>${data.endTime}</td><td>${data.ticketID}</td>`;
         reservedTable.querySelector('tbody').appendChild(newRow);
      })
      .catch(error => {
         console.error('Error:', error);
         // Handle errors or show an error message to the user
      });





   console.log('Name:', name);
   console.log('Lot ID:', lotId);
   console.log('Spaces Left:', spacesLeft);
   console.log('start:', startTime);
   console.log('end: ', endTime);
   // console.log('Time: ', getCurrentTimeCST());



   // Add your logic for reserving the lot here
   // For example, you can make an AJAX request to a server endpoint
}

function generateTicketID() {
   const prefix = "89";
   const remainingDigits = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
   return prefix + remainingDigits;
}

function getCurrentTimeCST() {
   const options = {
      timeZone: 'America/Chicago',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',

   };
   return new Date().toLocaleTimeString('en-US', options);
}

function getLotID(name) {
   var lotNumber = 0;
   switch (name) {
      case "West Stadium Lot":
         lotNumber = 101;
         break;
      case "Bernie Moore Lot":
         lotNumber = 104;
         break;
      case "Natatorium Lot":
         lotNumber = 105;
         break;
      case "Touchdown Village West Lot":
         lotNumber = 314;
         break;
      case "Touchdown Village East Lot":
         lotNumber = 315;
         break;
      case "West Parker Blvd. Lot":
         lotNumber = 316;
         break;
      case "South Stadium East Lot":
         lotNumber = 401;
         break;
      case "South Stadium West Lot":
         lotNumber = 401;
         break;
      case "South Quad Dr. West Lot":
         lotNumber = 403;
         break;
      case "Skip Bertman Dr. East Lot":
         lotNumber = 604;
         break;
      case "East Parker Blvd. Lot":
         lotNumber = 604;
         break;
      case "ECE West Lot":
         lotNumber = 402;
         break;
      case "Parker Coliseum Lot":
         lotNumber = 600;
         break;


   }
   return lotNumber;

}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

async function searchLot() {
   var input = document.getElementById('lotName').value.toLowerCase();
   var table = document.getElementById('lotTable');
   var rows = table.getElementsByTagName('tr');

   // Clear previous search results
   for (var i = rows.length - 1; i > 0; i--) {
      table.deleteRow(i);
   }

   try {
      // Fetch content from parkinginfo.ejs
      const response = await fetch('/parkinginfo');
      const html = await response.text();

      // Create a temporary container to parse the HTML
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = html;

      // Your HTML data
      var daysData = tempContainer.querySelectorAll('.accordion-section-2 .ou_6col');

      // Filter and display matching rows
      daysData.forEach((dayData, index) => {
         var rows = dayData.querySelectorAll('tr');

         for (var i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
            var columns = rows[i].querySelectorAll('td');
            var lotName = columns[0].textContent.toLowerCase();

            if (lotName.includes(input)) {
               var row = table.insertRow(-1);

               // Add day as the first column
               var dayCell = row.insertCell(0);
               dayCell.innerHTML = daysOfWeek[index];

               // Add other columns
               for (var j = 0; j < columns.length; j++) {
                  var cell = row.insertCell(j + 1); // Start from 1 to skip the day column
                  cell.innerHTML = columns[j].textContent;
               }
            }
         }
      });
   } catch (error) {
      console.error('Error fetching or parsing data:', error);
   }
}


