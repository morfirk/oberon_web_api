

window.onload = function () {
    //<editor-fold desc="Changeable Configuration Block">
   
    window.loginSalt = "";
    window.userData = "";

    // the following lines will be replaced by docker/configurator, when it runs in a docker-container
    window.ui = SwaggerUIBundle({
        url: "http://192.168.16.11:8084/openapi_oberon_web_gen1_hotel.json",
        //url: dataPath,
        //spec: window.jsonData,
        dom_id: '#swagger-ui',
        deepLinking: true,
        supportHeaderParams: true,
        presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
        ],
        plugins: [
            SwaggerUIBundle.plugins.DownloadUrl,
            OberonWebAuthorizePlugin
        ],
        layout: "StandaloneLayout",
        supportedSubmitMethods: ['get', 'post'],        
        onComplete: function () {
            if (console) {
                console.log("Loaded SwaggerUI")
            }
            //$('pre code').each(function(i, e) {hljs.highlightBlock(e)});
        },
        onFailure: function (data) {
            if (console) {
                console.log("Unable to Load SwaggerUI");
                console.log(data);
            }
        },
        requestInterceptor: function (request) {
            if (console) {
                console.log("Http intercept request")
            }
            if ( request.headers.hasOwnProperty('userData') ) {
                request.headers['userData'] = window.userData;
            }
            
            return request;
        },
        responseInterceptor: function (response) {
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

    /*
    // Predáme originálnu funkciu do smerníka
    var fnOriginalAuthorize = ui.authActions.authorize;

    ui.authActions.authorize = function(auth) {
        // 'CustomAuth' je definícia security schémy v definícii JSON
        /*
            "components": {
                "securitySchemes": {
                    "CustomAuth": {
        * /
        var password = auth.CustomAuth.value.password;
        var name = auth.CustomAuth.value.username;
        //var cfg = ui.getConfigs();
        //var url = cfg.url;        
        window.oberonWeb.apiAuthenticate( name, password);

        let auth2 = auth;
        fnOriginalAuthorize(auth);

        if(auth2) {

        }


    };
    */

    function OberonWebAuthorizePlugin() {
        return {
            statePlugins: {
                auth: {
                    wrapActions: {
                        authorize: (oriAction, system) => (auth) => {
                            const username = prompt("Enter username:");
                            const password = prompt("Enter password:");
                            
                            window.oberonWeb.apiAuthenticate( username, password);

                            return oriAction({
                                UserTokenAuth: {
                                    name: "userData",
                                    schema: { type: "apiKey", in: "header", name: "userData" },
                                    value: window.userData
                                }
                            });
                        }
                    }
                }
            }
        };   
    }

    //window.ui.api.apiclientAuthorizations.add("headerKey", new SwaggerClient.ApiKeyAuthorization("Some-Header", "Foo", "header"));
    //</editor-fold>
};