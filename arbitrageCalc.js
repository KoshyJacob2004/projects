
export const arbitrageCalc = (x , y) => {
    if (!x || !y) {
        return false;
    }
    const negetiveOddsCalc = (odds, wager) => {
        return (100/(odds*-1) * wager)
    }
    const positiveOddsCalc = (odds, wager) => {
        return (odds/100 * wager)
    }
    let  result = 0;
    if (x < 0) {
        result = negetiveOddsCalc(x, 100);
    }
    else {
        result = positiveOddsCalc(x, 100);
    }
    let arbitrageValue = 0;
    if (y < 0) {
        arbitrageValue =  negetiveOddsCalc(y, result);
    }
    else {
        arbitrageValue = positiveOddsCalc(y, result);
    }
    if (arbitrageValue > 100) {
        return true
    }

    
    return false;
} 

// export {arbitrageCalc}