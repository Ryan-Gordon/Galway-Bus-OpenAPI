import * as Routes from '../services/routeService';

/**
 * getSchedules
 */
module.exports.getAllRoutes = async (context) => {
    
    return await Routes.getAllRoutes()
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