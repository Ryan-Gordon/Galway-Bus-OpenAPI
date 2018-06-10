import * as Schedules from '../services/SchedulesService';

/**
 * getSchedules
 */
module.exports.getSchedules = async (context) => {
    
    return await Schedules.getSchedules()
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