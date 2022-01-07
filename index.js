import puppeteer from 'puppeteer';
import fs from 'fs';
(async () => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.jwst.nasa.gov/content/webbLaunch/whereIsWebb.html');

    setInterval(async function(){
        const data = await page.evaluate(() => {
            function getText(element, dataType) {
                let data = document.querySelector(element).textContent;
                if(dataType === 'float') data=parseFloat(data);
                return data;
            };
            
            let earthDistance = getText('#milesEarth', 'float');
            let l2Distance = getText('#milesToL2', 'float');
            let percentageDistance = getText('#percentageCompleted', 'float')
            let speedMi = getText('#speedMi', 'float')
            let data = {
                "imperial" : {
                    "earthDistance": earthDistance,
                    "l2Distance": l2Distance,
                    "percentageDistance": percentageDistance,
                    "cruisingSpeed": speedMi
                },
                "lastUpdated": new Date().toISOString()      
            }           
            return JSON.stringify(data, null, 2);
        });        
        fs.writeFileSync('data.json', data);
    }, 2000);

})();
