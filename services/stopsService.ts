import * as request from 'request-promise-native';
import * as turf from '@turf/turf';
import {Units} from '@turf/helpers';
import * as moment from 'moment-timezone';
/**
 * Get PDF links for all routes
 *
 * Returns a Promise.
 **/
export const getAllStops = async () =>{
    let stopsArray = new Array();
    let stop = new Object();

    let endpoint = 'https://data.dublinked.ie/cgi-bin/rtpi';
    return new Promise(async (resolve, reject) =>{
        try{
        
            //Prepare http options for request
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                },
                json: true,
                method: 'GET',
                resolveWithFullResponse: true,
                url: endpoint + '/busstopinformation?operator=be'
            };
            
            const response = await request(options)
            console.log(response)
            let results = response.body['results'];

            console.log(results)
    
        console.log("Formatting stops")
        results.forEach(async (json_stop) =>{

            const formatted_stop = await parse_stop(json_stop);
            console.log(formatted_stop);
            if (formatted_stop['galway'] == true) {
                stopsArray.push(formatted_stop);
            }
            
        });
      }
      catch{
        reject('Got an error')
      }
      finally{
          //If we reach here and the promise has already been rejected (Exception encountered) the promise will remain rejected 
        resolve(stopsArray);
      }
    });
  }

export const getStopsByStopRef = async (stop_ref) =>{
    let stopsArray = new Array();
    let stop = new Object();

    let endpoint = 'https://data.dublinked.ie/cgi-bin/rtpi';
    //Prepare a promise response for controller
    return new Promise(async (resolve, reject)=> {
    try{
        
        //Prepare http options for request
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            json: true,
            method: 'GET',
            resolveWithFullResponse: true,
            url: endpoint + '/busstopinformation?operator=be'
        };
        
        const response = await request(options)
        let results = response.body['results'];

        

    console.log("Formatting stops")

    await results.forEach(async (json_stop) =>{

        const formatted_stop = await parse_stop(json_stop);


        
        if (formatted_stop['galway'] == true) {
            //console.log("Found Galway Stop")
            stopsArray.push(formatted_stop);

            if (formatted_stop['stop_ref'] === stop_ref){
                console.log('Found a stop')
                console.log(formatted_stop)

                await parseRealTimesForStopRef(formatted_stop['stop_ref']).then(times => {
                    // Store the times for API response.
                    stop['times'] = times;
                    resolve(stop)
                }).catch((error)=> {
                    console.log("Error Encountered")
                    //should probably throw an exception so it catches instead
                    reject('Error parsing stop')
                })
            }
        }

    });
    
    
  }
  catch{
    reject('Got an error')
  }     
});


}

export const getNearbyStops = async (longitude,latitude)=>{
    let stopsArray = new Array();

    let endpoint = 'https://data.dublinked.ie/cgi-bin/rtpi';
    //Prepare a promise response for controller
    return new Promise(async (resolve, reject)=> {
    try{
        

       
        
        resolve(stopsArray);
  
    }catch(e){
        console.log("Catch"+ e)
        reject(e)
    }
});


}

const parseRealTimesForStopRef = async (stop_ref) =>{


	return new Promise(async (resolve, reject) => {
        let endpoint = 'https://data.dublinked.ie/cgi-bin/rtpi';
        //Prepare http options for request
        const options = {
            headers: {
                'Content-Type': 'application/json',
            },
            json: true,
            method: 'GET',
            resolveWithFullResponse: true,
            url: endpoint + '/realtimebusinformation?maxresults=10&operator=be&stopid=' + stop_ref
        };
        
        const response = await request(options)
        let results = response.body['results'];

		resolve(await parse_multiple_times(results));
		});
		
};
/**
 * Takes in a parameter representing all the incoming bus services for a stop.
 * The incoming services are then fed into the parse_time function
 * 
 * @param results 
 */
const parse_multiple_times = async (results) => {
    const times = await results.map(async (json_time) =>{
        console.log(json_time)
         return await parse_time(json_time);
    });
    console.log(times)
    return Promise.all(times);
}
/**
 * Takes in a parameter representing a Time on the timetable
 * This is a bus service on route to the stop and contains relevant info for how far away it is
 * 
 * The time is formatted into an ISO string.
 * 
 * TODO: Needs try catch just incase
 * @param json_time_object 
 */
const parse_time = async (json_time_object) =>{

    let formatted_time = new Object();
    formatted_time['display_name'] = json_time_object['destination'];
    formatted_time['irish_display_name'] = json_time_object['destinationlocalized'];
    formatted_time['timetable_id'] = json_time_object['route'];
    formatted_time['low_floor'] = json_time_object['lowfloorstatus'] === 'yes';


    // Convert 'dd/MM/yyyy HH:mm:ss' string into ISO format.

    let date_string = json_time_object['departuredatetime'];

    let is_dst = moment.tz("Europe/Dublin").isDST();

    if ((date_string != null) && (date_string.length > 0)) {

        var date_string_with_tz = "";

        if (is_dst == true) {
            date_string_with_tz = date_string + "+0100";
        }
        else {
            date_string_with_tz = date_string + "+0000";
        }

        let m = moment(date_string_with_tz, "DD/MM/yyyy HH:mm:ssZ");
        formatted_time['depart_timestamp'] = m.toISOString();
    }

    return formatted_time;
};
/**
 * Determine if a provided stop is in Galway
 * The API fetchs all stops in ireland 
 * Anything in a 10km radius of Eyre Square is considered 'in galway'
 * @param stop 
 */
const stop_in_galway =async (stop) =>{
    let eyre_square_coordinates = [-9.0514163, 53.2743426];
    let eyre_square_point = turf.point(eyre_square_coordinates);
    let lat = parseFloat(stop['latitude']);
    let lon = parseFloat(stop['longitude']);
    
    let stop_point = turf.point([lon, lat]);

    let units:Units ='meters';
    let options = {units}

    let distance_from_eyre_square = turf.distance(eyre_square_point, stop_point, options);

    return (distance_from_eyre_square < 10000.0);

};

/**
 * Take in a JSON object with stop information
 * Format it and determine if the stop is in Galway; the API pulls all Irish stops
 * @param json_stop_object 
 */
const parse_stop = async (json_stop_object) =>{

    let formatted_stop = new Object();
    formatted_stop['short_name'] = json_stop_object['shortname'];
    formatted_stop['long_name'] = json_stop_object['fullname'];
    formatted_stop['stop_id'] = parseInt(json_stop_object['stopid']);
    formatted_stop['stop_ref'] = json_stop_object['stopid'];
    formatted_stop['latitude'] = parseFloat(json_stop_object['latitude']);
    formatted_stop['longitude'] = parseFloat(json_stop_object['longitude']);


    formatted_stop['galway'] = await stop_in_galway(json_stop_object);

    return formatted_stop;
};

/**
 * timedPromise - A wrapper for other functions which return promises.
 * Promises can stall a system if they neither resolve nor reject.
 * 
 * Unless a promise is resolved or rejected it will run continously.
 * This timedPromise can be wrapped around another promise.
 * 
 * If the child promise does not finish within the specified amount of milliseconds
 * the parent process will submit a promise rejection so the user isin't stuck in deadlock.
 * 
 * Got the idea from : https://stackoverflow.com/questions/32461271/nodejs-timeout-a-promise-if-failed-to-complete-in-time
 *  
 * @param ms 
 * @param callback 
 */
function timedPromise(ms, callback) {
    return new Promise(function(resolve, reject) {
        // Set up the real work
        callback(resolve, reject);

        // Set up the timeout; if the defined work does not complete in time the promise will reject rather than waiting indefinetly
        setTimeout(function() {
            reject('Request timed out after ' + ms + ' ms');
        }, ms);
    });
}