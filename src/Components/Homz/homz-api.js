import React, { useState } from 'react';
import { Card, Input, Button } from 'antd';
import axios from 'axios';


const API_BODY_REQ = {
    "search": "Miami FL",
    "search_short": "Miami FL",
    "price": {
      "min": null,
      "max": null,
      "minFormat": "",
      "maxFormat": ""
    },
    "orderBy": "fcf_equity",
    "direction": "DESC",
    "pagination": {
      "page": 0,
      "pageSize": 25
    },
    "isMap": true,
    "property_type": ["Condo"],
    "rental_type": ["daily_rental"],
    "airbnb_matches": [],
    "withPriority": false,
    "map": {
      "northeast": {
        "lat": 26.068972479354947,
        "lng": -80.05643964804689
      },
      "southwest": {
        "lat": 25.541674434114487,
        "lng": -80.57554365195314
      }
    }
  }
  

const homzPromptDesign =( user_prompt ) => `
This is the request body for an API call to a real state startup.
The request body describes the parameters for searching property listings in Florida.
Each field of the request body represents a search parameter.

The only fields that matter are: price, and map

The map object contains two coordinates that delineate a square on the map.

In the sample request provided below, the map coordinates are for Brickel, at Miami.

${JSON.stringify(API_BODY_REQ)}

Your objective is to modify this variable requestBody to match the following search question:

  ${user_prompt}

Provide the JSON response such that it's parsable.


`

const coordinates_prompt = (input)=> `
We define a square on a map under the following coordinate definition:

"map":{"northeast":{"lat":26.068972479354947,"lng":-80.05643964804689},"southwest":{"lat":25.541674434114487,"lng":-80.57554365195314}}

Provide a coordinate box for ${input}.

Provide a rectangle that best suits this area within a one square kilometer.

For reference, the coordinnates of Miami beach are 25.7907° N, 80.1300° W;

Provide the answer in the form of comma separated values

north_east_lat, north_east_lng, southwest_lat, south_west_lng 

`;

async function callBackendCoordinates(coordinates){
    try {
        const response = await axios.post('https://openai-juan.herokuapp.com/api/homz_coordinate', {
          prompt_request: coordinates,
          origin: 'playgrounddd',
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        return response.data.res;
      } catch (error) {
  
        console.error(error);
      }


}



export default function HomzCard () {
  const [inputValue, setInputValue] = useState('');
  const [properties, setProperties ] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ error, setErr ] = useState('');

  

  async function callBackendCompletion (prompt_design){
    const response = await axios.post('https://openai-juan.herokuapp.com/api/chrome_request', {
      prompt_request: prompt_design,
      origin: 'playgrounddd',
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  }
  

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  async function handleSubmit() {
    setErr("")
    setLoading(true);
    const prompt = homzPromptDesign(inputValue);
    console.log(prompt);
    const fetch_coordinates = await callBackendCompletion(coordinates_prompt(inputValue));
    const [ne_lat, ne_lng, sw_lat, sw_lng] = fetch_coordinates.data.res.split(',');
    const req_object = {ne_lat, ne_lng, sw_lat, sw_lng}
    console.log('Coordinates', fetch_coordinates)
    const openai_response = await callBackendCompletion(prompt);
    const openai_obj = JSON.stringify(openai_response)
    console.log('Open AI Response',openai_obj)
    const coord = await callBackendCoordinates(req_object);
    if(coord.properties.total < 1) setErr("No results found for this Search using ChatGPT coordinate system");
    setProperties(coord.properties)
    
    console.log(coord)
    setLoading(false)
   
    console.log('API call triggered');
  };

  return (
    <div style={{marginTop:'100px'}}>
    <Card style={{  width:'90%', maxWidth:'500px' ,margin:'0 auto', backgroundColor: '#f5f5f5',
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: 16,}}>
      <Input
              style={{ marginBottom: 16 }}

        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter text"
      />
      <Button style={{
          background: 'linear-gradient(to right, #6a82fb, #fc5c7d)',
          borderColor: '#6a82fb',
          borderRadius: 4,
        }} onClick={handleSubmit}
        loading={loading}
        type="primary">
        Submit
      </Button>
      <h3>{error}</h3>
      {properties.total && <h4>{'Total listings ' + properties.total}</h4>}
    </Card>
    <div style={{margin:'0 auto', maxWidth:'500px'}}>
    {properties?.properties?.map( p => <Card extra={"$"+p.cost}>{  p.address}</Card>)}

    </div>
    </div>
  );
  
};

