import * as request from 'request-promise-native';

/**
 * Get PDF links for all routes
 *
 * Returns a Promise.
 **/
export function getAllRoutes( ){
    return new Promise((resolve, reject) =>{
      try{
        let schedules = new Array();
  
        //Manually pushing each routes details in the Array. 
        schedules.push({ route_id: 401, full_route_name : 'Salthill - Eyre Square', short_route_name : 'Salthill' });
        schedules.push({ route_id: 402, full_route_name : 'Merlin Park - Eyre Square - Seacrest', short_route_name : 'Merlin Park - Seacrest' });
        schedules.push({ route_id: 403, full_route_name : 'Eyre Square - Castlepark', short_route_name : 'Castlepark' });
        schedules.push({ route_id: 404, full_route_name : 'Newcastle - Eyre Square - Oranmore', short_route_name : 'Newcastle - Oranmore' }) ;
        schedules.push({ route_id: 405, full_route_name : 'Rahoon - Eyre Square - Ballybane', short_route_name : 'Rahoon - Ballybane' }) ;
        schedules.push({ route_id: 407, full_route_name : 'Eyre Square - Bóthar an Chóiste', short_route_name : 'Bóthar an Chóiste' }) ;
        schedules.push({ route_id: 409, full_route_name : 'Eyre Square - GMIT - Parkmore', short_route_name : 'Parkmore / GMIT' });
        
        resolve({routes: JSON.stringify(schedules)});
        
      }
      catch{
        reject('Got an error')
      }
    });
  }

export const getStopsByRouteID = async (route_id)=>{
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
            url: endpoint + '/routeinformation?operator=be&routeid=' + route_id
        };
        
        const response = await request(options)
        let results = response.body['results'];

        //Iterate over the routes. O(n) but there should be only 1; TODO: refactor
        results.forEach(routeDetail => {
            let goingFrom = routeDetail['origin'];
            let goingTo = routeDetail['destination'];
                
            
            //Iterate over the stops array. Details to be parsed and then added to a new array
            routeDetail['stops'].forEach(stopDetail => {
                stop['stop_id'] =stopDetail['stopid'];
                stop['stop_full_name'] =stopDetail['fullname'];
                stop['stop_short_name'] =stopDetail['shortname'];
                stop['longitude'] =stopDetail['longitude'];
                stop['latitude'] =stopDetail['latitude'];
                stop['from'] = goingFrom;
                stop['to'] = goingTo;
                
                //Push new object to Array
                stopsArray.push(stop);
            });//stops forEach
            
        });//results forEach
       
        
        resolve(stopsArray);
  
    }catch(e){
        console.log("Catch"+ e)
        reject(e)
    }
});


}
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