var cheerio = require('cheerio');

module.exports = {
	city: function(str) {
		var parsed = cheerio.load(str),
			cities = new Array();
		parsed('#WcLeftInfo1_WcPanel5_lstComuni_DropDown li').map(function(i, elem) {
			cities.push(cheerio(elem).text());
		});
		cities = cities.sort();
		return cities;
	},

	availableBikes: function availableBikes(str) {
		var parsed = cheerio.load(str),
			stations = new Array(),
			stationsLenght = parsed('#wcPGoogle_radRotStazioni ul li').length,
			name, 
			location, 
			quantity;
		// check 4 wrong input page
		if(stationsLenght === 0) return [];
		
		for(var i = stationsLenght; i >= 0; i--){
			name = parsed('#wcPGoogle_radRotStazioni_i' + i + '_Laber22').text();
			if(!name) continue;
			if(name.match(/Non Operativa|Non operativa/)){
				available = false;
				name = name.substr(0,name.search(/Non Operativa|Non operativa/));
			} else{
				available = true;
			}
			location = parsed('#wcPGoogle_radRotStazioni_i' + i + '_Label2').text();
			quantity = parsed('#wcPGoogle_radRotStazioni_i' + i +'_label23').text();
			//quantity = quantity.match(/\d+\D+/g);
			stations.push({'name': name.replace(/(\r\n|\n|\r|-)/g,"").trim()
						, 'available': available
						, 'location': location
						, 'bike': quantity.match(/\d+[ A-Za-z]+[ A-Za-z]+/g)});
		}
		return stations;
	},
	
	//test only
	parse: function(req, res){
		console.log('parsed');
		res.send('authenticated');
	}
}