import * as Stops from '../services/stopsService';

/**
 * getSchedules
 */
module.exports.getAllStops = async (context) => {
    
    return await Stops.getAllStops()
        .then((result) => {
            console.log("Result received by .then")
            //Here we can do mutations to the Promise result BEFORE its returned entirely
            //resp['new_attribute'] = 'coola boola'
            return result
        })
        .catch((result)=>{
            //Set status code and a rejection message
            context.res.setStatus(400);

            //context.res.status(400).end(); is chainable 
            return result
        })
}

/**
 * getSchedules
 */
module.exports.getStopsByRouteID = async (context) => {
    const stop_ref = await context.params.path.stop_ref;
    return await Stops.getStopsByStopRef(stop_ref)
        .then((result) => {

            //Here we can do mutations to the Promise result BEFORE its returned entirely
            //resp['new_attribute'] = 'coola boola'
            return result
        })
        .catch((result)=>{
            //Set status code and a rejection message
            context.res.setStatus(400);

            //context.res.status(400).end(); is chainable 
            return result
        })
}

/**
 * getSchedules
 */
module.exports.getNearbyStops = async (context) => {
    const longitude = await context.params.query.longitude;
    const latitude = await context.params.query.latitude;
    return await Stops.getNearbyStops(longitude,latitude)
        .then((result) => {

            //Here we can do mutations to the Promise result BEFORE its returned entirely
            //resp['new_attribute'] = 'coola boola'
            return result
        })
        .catch((result)=>{
            //Set status code and a rejection message
            context.res.setStatus(400);

            //context.res.status(400).end(); is chainable 
            return result
        })
}