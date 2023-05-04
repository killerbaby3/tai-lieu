// This example retrieves autocomplete predictions programmatically from the
// autocomplete service, and displays them as an HTML list.
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
var displaySuggestions = function (predictions, status) {
    if (status != google.maps.places.PlacesServiceStatus.OK || !predictions) {
      alert(status);
      return;
    }

    predictions.forEach((prediction) => {
      var li = document.createElement("li");

      li.appendChild(document.createTextNode(prediction.description));
      document.getElementById("results").appendChild(li);
    });
};
function initService(q = "") {
    if(q != ""){
        var service = new google.maps.places.AutocompleteService();
        service.getQueryPredictions({ input: q }, displaySuggestions);
    }
  }
  
window.initService = initService;

var debounce = function(fn, delay = 500){
    var timeoutId;
    return function(...args){
        // cancel the previous timer
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // setup a new timer
        timeoutId = setTimeout(function(){
            fn.apply(null, args)
        }, delay);
    };
};

var input = document.querySelector('#search');
input.addEventListener('keyup', debounce(function(e){
    window.initService(e.target.value);
}));