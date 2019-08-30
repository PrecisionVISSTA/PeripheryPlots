import _ from "lodash"; 
import WeatherData from "./seattle-weather.csv"; 

export default function loadData() {

    let data = []; 
    let indexMap = {}; 
    let catKeys = ['weather']; 
    let floatKeys = ['precipitation', 'temp_max', 'temp_min', 'wind']; 
    for (let i = 0; i < WeatherData.length - 1; i++) {
        let row = WeatherData[i]; 
        if (i === 0) {
            // Determine the index for each of the target keys to extract
            for (let j = 0; j < row.length; j++) {
                indexMap[row[j]] = j; 
            }
        } else {
            let datarow = {}; 
            for (let key of floatKeys) {
                datarow[key] = parseFloat(row[indexMap[key]]); 
            }
            for (let key of catKeys) {
                datarow[key] = row[indexMap[key]]; 
            }
            datarow.date = new Date(row[indexMap.date]); 
            data.push(datarow); 
        }
    }

    return data; 

}; 



