	function calculateTimeOnSite() {
            var endTime = new Date();
            var timeSpent = endTime - startTime; // Time in milliseconds

            // Convert milliseconds to seconds
            var timeSpentSeconds = Math.floor(timeSpent / 1000);

            return timeSpentSeconds;
    }
	
	function getSpecificQueryParams() {
        let params = {};
        let queryString = window.location.search.substring(1);
        let regex = /([^&=]+)=([^&]*)/g;
        let m;
        let desiredParams = ['PROLIFIC_PID', 'QUALTRICS_ID', 'STUDY_ID', 'SESSION_ID', 'GROUP'];
        while (m = regex.exec(queryString)) {
            let paramName = decodeURIComponent(m[1]);
            if (desiredParams.includes(paramName)) {
                params[paramName] = decodeURIComponent(m[2]);
            }
        }
        return params;
    }

	function redirectToQualtrics() {
		if (typeof startTime !== 'undefined') {
			let params = getSpecificQueryParams();
			let baseUrl = 'https://neuchatel.eu.qualtrics.com/jfe/form/SV_7PTidDG49kEnr5Y';
			let timeSpent = calculateTimeOnSite();

			if (timeSpent > 30) {
				
				//if(numberOfChats == 0){
					//forcedToChat = 1; // Yes
					//alert('Please interact with the NewsChat before going back to the survey.');
					//return;
				//}
				
				// Add timeSpent to params for URL
				params['timeSpent'] = timeSpent;
				
				// Add timeSpent to params for URL
				//params['forcedToChat'] = forcedToChat;

				// Construct the query string for URL parameters
				let queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
				let urlWithParams = queryString ? `${baseUrl}?${queryString}` : baseUrl;

				// Create a form element
				let form = document.createElement('form');
				form.method = 'POST';
				form.action = urlWithParams; // Set the action with URL parameters

				// Create an input field for the JSON data
				let input = document.createElement('input');
				input.type = 'hidden';
				input.name = 'chatData';  // Ensure this matches what the server expects
				input.value = JSON.stringify(chatData);

				// Append the input field to the form
				form.appendChild(input);

				// Append the form to the body
				document.body.appendChild(form);

				// Submit the form
				form.submit();
			} else {
				alert('Please spend more time onsite');
			}
		} else {
			alert('Please spend more time onsite');
		}
	}
