import * as request from 'request-promise-native';
import * as turf from '@turf/turf';
import {Units} from '@turf/helpers';
import * as moment from 'moment-timezone';
/**
 * getAllStops()
 * 
 * Parses the RTPi API for all stops.
 * Then iterates over the results to get all stops in a 10k radius of Galway city centre.
 */
export const getAllStops = async () =>{
    let stopsArray = new Array(); //Stops Array to be returned

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
            //Async HTTP request
            const response = await request(options)
            let results = response.body['results'];

            
    
            console.log("Formatting stops")
            results.forEach(async (json_stop) =>{
                //parse the stop object for useful info
                const formatted_stop = await parse_stop(json_stop);
                console.log(formatted_stop);

                //Only take the stops in galway
                if (formatted_stop['galway'] == true) {
                    stopsArray.push(formatted_stop);
                }
                
            });
            }
            catch{
                //Gracefully handle problems
                reject('Got an error')
            }
            finally{
                //If we reach here and the promise has already been rejected (Exception encountered) the promise will remain rejected 
                resolve(stopsArray);
            }
    });
  }
/**
 * getStopsByStopRef
 * @param stop_ref 
 * 
 * takes in a stop reference and gets the times for that stop
 */
export const getStopsByStopRef = async (stop_ref) =>{
    let stop = new Object(); //Stops Array to be returned

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
        /**
         * This bit of code is so dirty and expensive it deserves its own blockcomment
         * 
         * Iterates over every stop in ireland O(n) where n is 4000+
         * 
         * Calculates whether stop is in Galway (Doesnt need to be though)
         * Then checks if the stop equals the stop_ref; 
         * 
         * How could we improve this?
         * Caching stops would definetly help reduce the cost
         * 
         */
        await results.forEach(async (json_stop) =>{

            const formatted_stop = await parse_stop(json_stop);

            if (formatted_stop['stop_ref'] === stop_ref){

                await parseRealTimesForStopRef(formatted_stop['stop_ref']).then(times => {
                    // Store the times for API response.
                    stop['times'] = times;
                    resolve(stop)
                }).catch((error)=> {
                    console.log("Error Encountered")
                    //should probably throw an exception so it catches instead
                    reject('Error parsing stop')
                })
            }//if
        

        });//forEach
    }
    catch{
        reject('Got an error')
    }     
    }); //Promise
}
/**
 * getNearbyStops
 * @param longitude 
 * @param latitude 
 * 
 * Takes in 2 parameters representing a geographic location and finds the nearest stops to that.
 * 
 * Not fully working yet.
 */
export const getNearbyStops = async (longitude,latitude)=>{
    let stopsArray = new Array();
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

       
        //Refactor this into a function
        console.log("Formatting stops")
        results.forEach(async (json_stop) =>{

            const formatted_stop = await parse_stop(json_stop);

            stopsArray.push(formatted_stop);
            
        });
        //At the moment needs to be inline, serves as a predicate for the sort
        const sort_distance = async (s1, s2) =>{

            let point = turf.point([longitude, latitude]);

            var p1 = await point_from_stop(s1);
            var p2 = await point_from_stop(s2);
            let units:Units ='meters';
            let options = {units}

            let d1 = turf.distance(point, p1, options);
            let d2 = turf.distance(point, p2, options);
        
            s1['distance'] = d1;
            s2['distance'] = d2;
        
            if (s1 > s2) {
                return 1;
            }
        
            if (s1 < s2) {
                return -1;
            }
        
            return 0;
        }
        //The sort isint working right... yet
        resolve(await results.sort(sort_distance).slice(0, 10)); 
    }catch(e){
        console.log("Catch"+ e)
        reject(e)
    }
});


}

const point_from_stop = async (stop) =>{

    var lat = parseFloat(stop['latitude']);
    var lon = parseFloat(stop['longitude']);

    var stop_point = turf.point([lon, lat]);

    return stop_point;

}

/**
 * 
 */


/**
 * Takes in a stop reference and queries the realtime API for bus services at that stop
 * 
 * Has 2 helper functions parse_multiple_times which invokes parse_time
 * @param stop_ref 
 */
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