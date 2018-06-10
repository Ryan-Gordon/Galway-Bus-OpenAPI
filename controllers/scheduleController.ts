

module.exports.getSchedules = (context) => {
    let schedules = new Array();

    //Manually pushing each routes details in the Array. 
	schedules.push({ route_id: 401, route_name: 'Salthill - Eyre Square', pdf_link : 'http://www.buseireann.ie/timetables/1425472464-401.pdf' });
	schedules.push({ route_id: 402, route_name: 'Merlin Park - Eyre Square - Seacrest', pdf_link : 'http://www.buseireann.ie/timetables/1464192900-402.pdf' });
	schedules.push({ route_id: 403, route_name: 'Eyre Square - Castlepark', pdf_link : 'http://www.buseireann.ie/timetables/1464193090-403.pdf' });
	schedules.push({ route_id: 404, route_name: 'Newcastle - Eyre Square - Oranmore',pdf_link : 'http://www.buseireann.ie/timetables/1475580187-404.pdf' }) ;
	schedules.push({ route_id: 405, route_name:'Rahoon - Eyre Square - Ballybane', pdf_link : 'http://www.buseireann.ie/timetables/1475580263-405.pdf' }) ;
	schedules.push({ route_id: 407, route_name:'Eyre Square - Bóthar an Chóiste and return', pdf_link : "http://www.buseireann.ie/timetables/1425472732-407.pdf" }) ;
	schedules.push({ route_id: 409, route_name:'Eyre Square - GMIT - Parkmore', pdf_link : 'http://www.buseireann.ie/timetables/1475580323-409.pdf' });


    //Should try and include the CityDirect buses too.
    //context.res.setStatus(200)
    
   
    return {schedules: JSON.stringify(schedules)};
}