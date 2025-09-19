

window.onload = function () {
    //<editor-fold desc="Changeable Configuration Block">
   
    window.loginSalt = "";
    window.userData = "";
    
    window.ui = SwaggerUIBundle({
        urls: [ 
            { url: window.location.origin + "/openapi_oberonweb_g1_hotel.json", name: "Hotelová recepcia" },
            { url: window.location.origin + "/openapi_oberonweb_g1_v1_hotel.json", name: "Hotelová recepcia V1" }
         ],
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
        supportedSubmitMethods: ['get', 'post']        
    });


    // OBERON Login plugin for SWAGGER to enable authorization
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

    //</editor-fold>
};