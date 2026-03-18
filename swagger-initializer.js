

window.onload = function () {
    //<editor-fold desc="Changeable Configuration Block">
       
    window.ui = SwaggerUIBundle({
        urls: [ 
            { url: "./openapi_oberonweb_g1_hotel.json", name: "Hotelová recepcia" },
            { url: "./openapi_cashregister_g1_bonovaci_monitor.json", name: "Bonovací Monitor" }
         ],
        dom_id: '#swagger-ui',
        deepLinking: true,
        supportHeaderParams: true,
        persistAuthorization: true, // Autorizácia bude uložená do localstorage
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
        validatorUrl: null // Pokiaľ nie je súbor prístupný z internetu tak nie je možné automaticky validovať
    });


    // OBERON Login plugin for SWAGGER to enable authorization
    function OberonWebAuthorizePlugin() {
        return {
            statePlugins: {
                spec: {
                    wrapActions: {
                        updateSpec: (ori, {specActions}) => (...args) => {
                            ori(...args);
                            // Toto je tu len kvôli tomu aby to prvý krát nabehlo v svetlej schéme
                            if( document.documentElement.classList.contains("dark-mode") ) document.documentElement.classList.remove("dark-mode");
                        }
                    },                    
                },   
                auth: {
                    wrapActions: {                             
                        logout: (oriAction, system) => (payload) => {
                            // Logout
                            const configs = system.getConfigs();
                            const authorized = system.authSelectors.authorized();
                            try {
                                if (configs.persistAuthorization && Array.isArray(payload)) {
                                    payload.forEach((authorizedName) => {
                                        const auth = authorized.get(authorizedName, {})
                                        const isApiKeyAuth = auth.getIn(["schema", "type"]) === "apiKey"
                                        const isInHeader = auth.getIn(["schema", "in"]) === "header"
                                        if ( isApiKeyAuth && isInHeader ) {
                                            window.oberonWeb.apiLogout();
                                        }
                                    })
                                }
                            } catch (error) {
                                console.error(
                                    "Error deleting cookie based apiKey from document.cookie.",
                                    error
                                )
                            }
                            oriAction(payload);
                        },
                        authorize: (oriAction, system) => (payload) => {
                            // Authorization handling
                            const res = window.oberonWeb.apiAuthenticate(system);
                            if( res ) {
                                return oriAction({
                                    UserTokenAuth: {
                                        name: "userData",
                                        schema: { type: "apiKey", in: "header", name: "userData" },
                                        value: window.oberonUser.token
                                    }
                                });
                            }
                            oriAction(payload);
                        }
                    }
                }
            }
        };   
    }

    //</editor-fold>
};