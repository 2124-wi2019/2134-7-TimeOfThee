window.addEventListener('load',() =>{
    const right = document.getElementById('right');
    const airportCode = document.getElementById('airportCode');
    const actionGetWeather = document.getElementById('actionGetWeather');

    actionGetWeather.addEventListener('click', () => {
        if(checkAirportCode()){
            //Begin Step 6
            clearLoading();
            //End Step 6
            displayLoading('right');
            const url= 'https://w1.weather.gov/xml/current_obs/display.php?stid=K' + airportCode.value;

            fetch(url)
            .then((response) => {
                if(response.ok){
                    return response;
                }
                throw new Error('Error: '+response.statusText);
            })
            .then(response => response.text())
            .then(text => displayData(text))
            .catch(error => console.log(error));
        }
    });

    //Begin Step 2
    document.getElementById('airportCode').addEventListener('focusout',()=>{//loose focus?
        if(!checkAirportCode()){//invalid code?
            document.getElementById('airportCode').focus();
            document.getElementById('errorHolder').innerHTML='Invalid airport code';
            document.getElementById('errorHolder').classList.remove('hidden');
            document.getElementById('errorHolder').classList.add('error');
            document.getElementById('errorHolder').classList.add('errorBox');
            document.getElementById('errorHolder').classList.add('visible');
        }else{//hide
            document.getElementById('errorHolder').classList.add('hidden');
            document.getElementById('errorHolder').classList.remove('visible');
        }
    });
    //End Step 2
    
    //Helper Functions
    function displayLoading(side, loadingText){
        if(loadingText == undefined) loadingText = "loading content...";
        if((side != 'left')&&(side != 'right')){
            throw new Error('displayLoading accepts "right" and "left" only')
        }else{
            const container = document.getElementById(side);

            let loadingTextContainer = document.createElement('p');
            loadingTextContainer.innerHTML = loadingText;
            container.appendChild(loadingTextContainer);

            let loadingImageContainer = document.createElement('div');
            loadingImageContainer.classList.add('loading');
            loadingImageContainer.classList.add('centered');
            container.appendChild(loadingImageContainer);
        }
    }

    function clearLoading(){
        right.innerHTML = '';
    }
    //Begin Step 3
    function checkAirportCode(){
        const airportCodeValue = airportCode.value;
        if(airportCodeValue.length != 3) return false;
        else{
            const check=[
                'anw','bvn','aia','auh','bie','bta','hde','bbw','cdr','olu','fnb','fet','gri','hsi','hjh','iml','ear','ibm','lxn','lnk','mck','mle','afk','ofk','lbf','onl','oga','off','oma','odx','pmv','bff','sny','tqe','tif','vtn','ahq','lcg','jyr'
            ];
            for(var a=0;a<check.length;a++){
                if(airportCodeValue.toLowerCase()==check[a])return true;
            }
        }
        return false;
    }
    //End Step 3
    
    function displayData(xml){
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, 'text/xml');
        console.log(xmlDoc);
        let location = xmlDoc.getElementsByTagName('location')[0].innerHTML;
        let temp_f = xmlDoc.getElementsByTagName('temp_f')[0].innerHTML;
        //Begin Step 4
        let temp_c = xmlDoc.getElementsByTagName('temp_c')[0].innerHTML;//get more data
        //windchill doesn't seem to exist in the xml
        //let windchill_f = xmlDoc.getElementsByTagName('windchill_f')[0].innerHTML;
        //let windchill_c = xmlDoc.getElementsByTagName('windchill_c')[0].innerHTML;
        let visibility_mi = xmlDoc.getElementsByTagName('visibility_mi')[0].innerHTML;
        let wind_mph = xmlDoc.getElementsByTagName('wind_mph')[0].innerHTML;
        //Begin Step 5
        let img_src= xmlDoc.getElementsByTagName('icon_url_base')[0].innerHTML;//image base
        //Begin Step 6
        img_src=img_src.substring(0,img_src.length-6)+"large/";
        //End Step 6
        img_src+=xmlDoc.getElementsByTagName('icon_url_name')[0].innerHTML;//image end
        //Pause Step 5

        let div = document.createElement('div');//make div
        let h1 = document.createElement('h1');//make h1
        h1.innerHTML='Current Weather';
        div.appendChild(h1);
        let h2 = document.createElement('h2');//make h2
        h2.innerHTML=`Location: ${location}`;
        div.appendChild(h2);
        let pa=document.createElement('p');//make p
        pa.appendChild(document.createTextNode(`Temperature: ${temp_f} \xB0 F (${temp_c} \xB0 C)
\nWind Speed: ${wind_mph} MPH
\nVisibility: ${visibility_mi} miles`));
        div.appendChild(pa);
        //Continue Step 5
        let img=document.createElement("img");//make image
        img.src=img_src;
        div.appendChild(img);
        //End Step 5
        right.innerHTML = div.innerHTML;
        //End Step 4
    }
});
