import puppeteer from "puppeteer";
import { arbitrageCalc } from "./arbitrageCalc.js";
import { nfl } from "./NFL.js";
import { ncaa } from "./NCAA.js";

const url = "https://www.vegasinsider.com/mlb/odds/las-vegas/";

const brandNameSelector = (x) => {
    if (x==0) {
        return "Bet365"
    }
    else if (x==1) {
        return "Fanduels"
    }
    else if (x==2) {
        return "BetMGM"
    }
    else if (x==3) {
        return "Caesers"
    }
    else if (x==4) {
        return "PointsBet"
    }
    else if (x==5) {
        return "DraftKings"
    }
    else if (x==6) {
        return "BetRivers"
    }
    else if (x==7) {
        return "UniBet"
    }
}

const main = async () => {
    // nfl();
    await ncaa();
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        userDataDir: "./tmp"
    });
    const page = await browser.newPage();
    await page.goto(url);

    // const betList  = await page.$$('.odds-table-moneyline--0 .active');
    const betListTop  = await page.$$('#odds-table-moneyline--0 > .divided');

    const betListBottom = await page.$$('#odds-table-moneyline--0 > .footer');
    
    let betDataFull = [];
    
    let positionTop = 1;
    for(const teams of betListTop){
        let data = {};
        const teamName = await page.evaluate(el => el.querySelector("a > span").textContent, teams)
        data.name = teamName;
        data.position = positionTop; 
        for (var i = 0; i < 9; i++) {
        try {
        let v = i;
        // console.log(v)
        const moneyline = await page.evaluate((el, v) => el.querySelectorAll(".game-odds > a > .data-moneyline")[v].textContent, teams, v)
        const value = brandNameSelector(i);
        data[value] = moneyline;
        // console.log(moneyline)
        }
        catch(error) {
        }
    }
        // console.log(data) 
        betDataFull.push(data)
        positionTop++;
    }

    let positionBottom = 1;
    for (const teams of betListBottom) {
        let data = {};
        const teamName = await page.evaluate(el => el.querySelector("a > span").textContent, teams)
        data.name = teamName;
        data.position = positionBottom; 
        for (var i = 0; i < 9; i++) {
            try {
            let v = i;
            // console.log(v)
            const moneyline = await page.evaluate((el, v) => el.querySelectorAll(".game-odds > a > .data-moneyline")[v].textContent, teams, v)
            const value = brandNameSelector(i);
            data[value] = moneyline;
            // console.log(moneyline)
            }
            catch(error) {
            }
    }
    // console.log(data) 
    betDataFull.push(data)
    positionBottom++;
}

console.log(betDataFull);

for(let i = 0; i < 4; i++) {
    for(let g = 0; g < 8; g++) {
        const conv1 = brandNameSelector(g);
        // console.log(betDataFull[i])
        const topValue = betDataFull[i][conv1];
        if(topValue == 'even') {
            topValue = 100;
        } 
        const topValueInt = parseInt(topValue)
    for(let v = 0; v < 8; v++) {
        const conv2 = brandNameSelector(v);
        const bottomValue = betDataFull[i + (betDataFull.length)/2.0][conv2];  
        if(bottomValue == 'even') {
            bottomValue = 100;
        }     
        const bottomValueInt = parseInt(bottomValue)  
        const result = arbitrageCalc(topValueInt, bottomValueInt)
        if (result) {
            console.log("POTENTIAL MATCH, DETAILS:")
            console.log(betDataFull[i].name, "versus", betDataFull[i + 4].name,)
            console.log("Bet with", conv1, "for", betDataFull[i][conv1], "with" , betDataFull[i].name, "and" )
            console.log("Bet with", conv2, "for", betDataFull[i+4][conv2], "with" , betDataFull[i+4].name,"\n")
        }
    }
    }

}
    await browser.close();
}

main();