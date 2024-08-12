document.addEventListener('DOMContentLoaded', () => {
    // Store selected amenities
    const selectedAmenities = {};
  
    // Handle checkbox changes for amenities
    $('input[type="checkbox"]').change(function() {
        const amenityId = $(this).attr('data-id');
        const amenityName = $(this).attr('data-name');
  
        if ($(this).is(':checked')) {
            selectedAmenities[amenityId] = amenityName;
        } else {
            delete selectedAmenities[amenityId];
        }
  
        const amenitiesList = Object.values(selectedAmenities).join(', ');
        $('div.amenities h4').text(amenitiesList);
    });
    $('button').click(function () {
        // Make a POST request to places_search with the list of checked amenities
        $.ajax({
          type: 'POST',
          url: 'http://0.0.0.0:5001/api/v1/places_search/',
          contentType: 'application/json',
          data: JSON.stringify({ amenities: Object.keys(amenities) }),
          success: function (data) {
            $('section.places').empty(); // Clear the current places
    
            // Iterate over the response and append the places to the section
            data.forEach(place => {
              const article = 
                <article>
                  <div class="title_box">
                    <h2>${place.name}</h2>
                    <div class="price_by_night">$${place.price_by_night}</div>
                  </div>
                  <div class="information">
                    <div class="max_guest">${place.max_guest} Guests</div>
                    <div class="number_rooms">${place.number_rooms} Bedrooms</div>
                    <div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>
                  </div>
                  <div class="description">
                    ${place.description}
                  </div>
                </article>;
              $('section.places').append(article);
            });
          }
        });
      });
  
    // Check API status
    $.get("http://0.0.0.0:5001/api/v1/status/", function(data) {
        if (data.status === "OK") {
            $("#api_status").addClass("available");
        } else {
            $("#api_status").removeClass("available");
        }
    });
  
    // Fetch and display all places
    const apiUrl = 'http://0.0.0.0:5001/api/v1/places_search/';
    
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
        const placesSection = document.querySelector('section.places');
        placesSection.innerHTML = '';  // Clear any existing content
  
        data.forEach(place => {
            const article = document.createElement('article');
  
            const titleBox = document.createElement('div');
            titleBox.className = 'title_box';
            const h2 = document.createElement('h2');
            h2.textContent = place.name;
            const priceByNight = document.createElement('div');
            priceByNight.className = 'price_by_night';
            priceByNight.textContent = `$${place.price_by_night}`;
            titleBox.appendChild(h2);
            titleBox.appendChild(priceByNight);
  
            const information = document.createElement('div');
            information.className = 'information';
            const maxGuest = document.createElement('div');
            maxGuest.className = 'max_guest';
            maxGuest.textContent = `${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}`;
            const numberRooms = document.createElement('div');
            numberRooms.className = 'number_rooms';
            numberRooms.textContent = `${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}`;
            const numberBathrooms = document.createElement('div');
            numberBathrooms.className = 'number_bathrooms';
            numberBathrooms.textContent = `${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}`;
            information.appendChild(maxGuest);
            information.appendChild(numberRooms);
            information.appendChild(numberBathrooms);
  
            const description = document.createElement('div');
            description.className = 'description';
            description.innerHTML = place.description;
  
            article.appendChild(titleBox);
            article.appendChild(information);
            article.appendChild(description);
  
            placesSection.appendChild(article);
        });
    });
  });
  