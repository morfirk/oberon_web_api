
(function () {
    /*
    Exalogic - API module    
    by Mario Moravcik - August 2023
    Test: SK1020000938 , SK2021861127
    */  
    var eModule = (function () {
        window.oberonWeb = eModule;        
        eModule.salt = "";
        eModule.url = "";       
        eModule.controls = {
            servers: null   
        }

        //-- init objekt
        function eModule(options) {            
        };
        
        eModule.apiAuthenticate = function(userName, password) {            
            let param = { username: userName };
            if(!eModule.controls.servers) {
                eModule.controls.servers = document.querySelector('.servers select');
            }
            var url = eModule.getUrl();
            eModule.apiCall(url + '/GetLoginSalt', param, eModule.evhLoginSalt);
            if ( ! window.loginSalt ) {
                return false;
            }

            let pass = window.loginSalt;
            if(password && password.length > 0) pass += password;
            pass = sha1(pass);

            param = { loginData: { UserName: userName, Password: pass, LoginTag: 'OBERONWeb' } };
            eModule.apiCall(url + '/LoginUserEx', param, eModule.evhLoginEx);
            if ( ! window.userData ) {
                return false;
            }
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
            let res = eModule.dataResult(xhr);
            if(res.result == true) {
                window.loginSalt = res.data;
            }

        }
        eModule.evhLoginEx = function(xhr) {
            let res = eModule.dataResult(xhr);
            if(res.result == true) {
                window.userData = res.data;
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

        return eModule;
    })();

    //window.oberonWeb = new eModule(window, {});

}).call(this);

