

window.onload = function () {
    //<editor-fold desc="Changeable Configuration Block">
   
    window.loginSalt = "";
    window.userData = "";

    window.ui = SwaggerUIBundle({
        url: "https://raw.githubusercontent.com/morfirk/oberon_web_api/refs/heads/main/openapi_oberon_web_gen1_hotel.json",
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