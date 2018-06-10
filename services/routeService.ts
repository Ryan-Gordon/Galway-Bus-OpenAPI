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