window.onload = function() {
  //<editor-fold desc="Changeable Configuration Block">
    
    window.oberonSalt = "";
    window.oberonAuth = "";

    // the following lines will be replaced by docker/configurator, when it runs in a docker-container
    window.ui = SwaggerUIBundle({
        url: "https://raw.githubusercontent.com/morfirk/oberon_web_api/refs/heads/main/openapi_oberon_web_gen1.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        supportHeaderParams: true,
        presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
        ],
        plugins: [
            SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",    
        supportedSubmitMethods: ['get', 'post'],
        onComplete: function(){
            if(console) {
                console.log("Loaded SwaggerUI")
            }
        },
        onFailure: function(data) {
            if(console) {
                console.log("Unable to Load SwaggerUI");
                console.log(data);
            }
        },
        requestInterceptor: function(request) {
            if (console) {
                console.log("Http intercept request")
            }
            if ( request.headers.hasOwnProperty('userData') ) {
                request.headers['userData'] = window.userData;
            }
            if(request.url.includes("SwaggerLogin")) {
                // Ĺ pecialita
                request.headers['userData'] = window.userData;
            } 
            return request;
        },
        responseInterceptor: function(response) {
            if (console) {
                console.log("Http intercept response")
            }
            if(response) {
                if(response.url.includes('GetLoginSalt')) {
                    // Salt
                    if ( response.body && response.body.result == true) {
                        window.loginSalt = response.body.data;
                    }
                }                
            }
            return response;
        },
    });

//</editor-fold>
};
