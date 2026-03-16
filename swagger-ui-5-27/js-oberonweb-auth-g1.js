
(function () {
    /*
    Exalogic - API module    
    by Mario Moravcik - August 2025
    */  
    var eModule = (function () {
        window.oberonWeb = eModule;
        window.oberonUser = {};
        window.oberonData = "";
        eModule.url = "";       
        eModule.controls = {
            servers: null   
        }

        //-- init objekt
        function eModule(options) {            
        };
        
        eModule.apiLogout = function() {
            localStorage.setItem("userData", "");
            localStorage.setItem("userName", "");
            localStorage.setItem("userPass", "");
        };
        
        eModule.apiAuthenticate = function(swaggerSystem) {
            if(!eModule.controls.servers) {
                eModule.controls.servers = document.querySelector('.servers select');
            }          
            window.oberonUser = { apiUrl: "", userName: "", password: "", token: "", salt: "" };
            window.oberonUser.apiUrl = eModule.getUrl();
            let userData = window.oberonUser;          
            userData = loadUserData(userData);

            if ( window.oberonUser.token !== null && window.oberonUser.token !== "" ) {
                window.oberonUser = userData;
                return true;
            }

            userData = promptUser(userData);            
            if ( userData.userName == "" || userData.userName.length == 0 ) {
                return false;
            }

            let param = { userName: userData.userName };
            
            var url = eModule.getUrl();
            eModule.apiCall(url + '/GetLoginSalt', param, eModule.evhLoginSalt);
            if ( ! window.oberonData ) {
                return false;
            }
            userData.salt = window.oberonData;

            let pass = "";
            if(userData.password && userData.password.length > 0) pass = sha1(userData.salt + userData.password);
            
            param = { loginData: { UserName: userData.userName, Password: pass, LoginTag: 'OBERONWeb' } };
            eModule.apiCall(url + '/LoginUserEx', param, eModule.evhLoginEx);
            if ( ! window.oberonData ) {
                return false;
            }
            userData.token = window.oberonData;
            window.oberonUser = userData;
            saveUserData(userData);            
            return true;
        };

        


        eModule.apiCall = function(url, param, handlerMethod) {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                 handlerMethod(xhr)
            };
            // We cant call as async, cause the authorization cant handle this type
            if (param == null) {
                xhr.open("GET", url, async=false);
                xhr.send(null);
            } else {
                xhr.open("POST", url, async=false );
                xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
                const body = JSON.stringify(param);
                xhr.send(body);
			}
        }

        eModule.evhLoginSalt = function(xhr) {
            window.oberonData = "";
            let res = eModule.dataResult(xhr);
            if(res.result == true) {
                window.oberonData = res.data;
            }

        }
        eModule.evhLoginEx = function(xhr) {
            window.oberonData = "";
            let res = eModule.dataResult(xhr);
            if(res.result == true) {
                window.oberonData = res.data;               
            }

        }

        
        eModule.getUrl = function() {
            return eModule.controls.servers.options[eModule.controls.servers.selectedIndex].value;
        }

        eModule.dataResult = function(xhr) {
            let res = eModule.resultOf();
            if ( !xhr || xhr.responseText === '' ) {
                res.description = 'Server neodpovedal, prípadne problém s pripojením.';
            } else {
                let o = JSON.parse(xhr.responseText);
                if (!o) {
                    res.description = 'Chybná odpoveď servera.';
                } else if ( !o.hasOwnProperty('result') ) {
                    res.description = 'Nesprávna štruktúra údajov API.';
                } else {
                    res = o;
                }
            }                
            return res;
        }

        eModule.resultOf = function() {
            return {
                result: false,
                errNumber: 0,
                description: null,
                data: null
            }
        }

        function loadUserData(userData) {
            let oberonAuth =  localStorage.getItem("oberonAuth");
            if ( oberonAuth && userData.apiUrl !== oberonAuth.apiUrl) {
                console.log("Url sa nezhoduje s uloženými prihlasovacími údajmi. Prihlasujeme nanovo.")
                return userData;
            }            
            userData.token = oberonAuth.token;
            userData.userName = oberonAuth.userName;
            userData.password = oberonAuth.password;
            userData.salt = oberonAuth.salt;
            return userData;
        }

        function saveUserData(userData) {
            localStorage.setItem("oberonAuth", JSON.stringify(userData));
            return userData;
        }

        function promptUser(userData) {
            userData.userName = prompt("Enter username:");
            userData.password = prompt("Enter password:");
            return userData;
        }

        return eModule;
    })();

}).call(this);

