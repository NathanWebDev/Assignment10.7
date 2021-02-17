'use strict';

const apiKey = 'iUEIjJbGTro0vegefnYc2LwIsnlZgdhj0AStVA5b';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayResults(responseJson){
    console.log(responseJson);
    $('#results-list').empty();
    $('#js-error-message').empty();
    
    if (responseJson.data.length === 0){
        $('#results-list').append(
            `<p>No National parks found under that name.</p>`
        )}
    
    for (let i = 0; i < responseJson.data.length; i++){
        $('#results-list').append(
            `<li><h3>${responseJson.data[i].fullName}</h3>
            <a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a>
            <p>${responseJson.data[i].description}</p>
            <p>${responseJson.data[i].addresses[0].line1} ${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode} ${responseJson.data[i].addresses[0].postalCode}</p>
            </li>`
        );
    }
    $('#results').removeClass('hidden');
};

function getData(userStates, maxItems){
    
    const params = {
        limit: maxItems,
        q: userStates
    }
    
    const queryString = formatQueryParams(params);
    const url = searchURL + '?' + queryString + '&api_key=' + apiKey

    console.log(url);

    fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm(){
    $('#js-form').submit(event => {
        event.preventDefault();
        const userStates = $('#state-input').val();
        const maxItems = $('#max-items-input').val();
        getData(userStates, maxItems);
        console.log('watchForm ran');
    })
}

$(watchForm);