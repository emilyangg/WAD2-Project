


function display_default() {
    CP_avail()
    CP_rates()

}

function CP_avail(){
    var request = new XMLHttpRequest;

    request.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            var response_json = JSON.parse(this.responseText);

            // TimeStamp
            // CP lot type
            // CP lots available (2)
            // CP Number (1)
            document.getElementById("CP_avail_timestamp").innerText = Object(response_json)['items'][0]['timestamp']
            CP_array = Object(response_json)['items'][0]['carpark_data']
            CP_info = Object(Object(CP_array[0])['carpark_info'])[0]
            document.getElementById("CP_num").innerText = CP_array[0]['carpark_number']
            document.getElementById("lot_avail").innerText = CP_info['lots_available']
            document.getElementById("lot_type").innerText = CP_info['lot_type']
            // console.log(response_json)
      
            
            // console.log(Object(Object(CP_array[0])['carpark_info'])[0]['lots_available'])
   
            
        }

    }

    var url = "https://api.data.gov.sg/v1/transport/carpark-availability"
        request.open("GET", url, true);
        request.send();

}

function CP_rates(){
    var request = new XMLHttpRequest;

    request.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            var response_json = JSON.parse(this.responseText);

            // CP Name:
            // CP Region (NSEW):
            // Weekday (before 5/6pm):
            // Weekday (after 5/6pm):
            // Saturday:
            // Sunday and PH:

            
            records = response_json['result']['records']
            
            carpark_name = records[1]['carpark']
            region = records[1]['category']
            morning = records[1]['weekdays_rate_1']
            night = records[1]['weekdays_rate_2']
            sat_rate = records[1]['saturday_rate']
            sun_ph_rate = records[1]['sunday_publicholiday_rate']



            document.getElementById("CP_name_attractions").innerText = carpark_name
            document.getElementById("CP_region").innerText = region
            document.getElementById("CP_weekday_early_rates").innerText = morning
            document.getElementById("CP_weekday_late_rates").innerText = night
            document.getElementById("CP_sat_rates").innerText = sat_rate
            document.getElementById("CP_sun_rates").innerText = sun_ph_rate
        
            // console.log(records[1]['category'])
        }

    }

    var url = "https://data.gov.sg/api/action/datastore_search?resource_id=85207289-6ae7-4a56-9066-e6090a3684a5"
        request.open("GET", url, true);
        request.send();
        
}
