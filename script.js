function getCovid(county, state) {
    console.log("string")
    $.ajax({
        url: "https://covid19-us-api.herokuapp.com/county",
        method: "GET"
    }).then(function (response) {
        var state_data = [];
        var countyCount = 0;
        var stateCount = 0;
        response.message.forEach(item => {
            search(item.county_name,item.state_name, exampleArray, item);
            if (item.state_name === state) {
                var data = {
                    county: item.county_name,
                    newCases: item.new,
                }
                state_data.push(data)
                // console.log(data);
            }
        });
        state_data.forEach(item => {
            if (item.county === county) {
                countyCount = item.newCases;
            }
            stateCount += item.newCases;
        })
        // console.log(stateCount);
        


        // add up all the data to the state and divide it by all the counties on the list
        // search list for the specific counties
        var covidRisk = (stateCount / state_data.length) + countyCount;
        // console.log(covidRisk);
    })
}
getCovid("Pierce", "Washington");


function search(countyKey,stateKey, exampleArray, obj) {
    for (var i = 0; i < exampleArray.length; i++) {
        if (exampleArray[i].county === countyKey && exampleArray[i].state === stateKey) {
            exampleArray[i].covid = {
                "confirmed": obj.confirmed,
                "new": obj.new,
                "death": obj.death,
                "new_death": obj.new_death,
                "fatality_rate": obj.fatality_rate
            }
        }
    }
}
var exampleArray = [
    {
        ascent: 1493,
        conditionStatus: "Minor Issues",
        county: "Pierce",
        covidStatus: "",
        descent: -1485,
        difficulty: "blueBlack",
        id: 7002140,
        image: "https://cdn2.apstatic.com/photos/hike/7011377_medium_1554559259.jpg",
        latitude: 46.787,
        length: 5.3,
        location: "Eatonville, Washington",
        longitude: -121.735,
        name: "Skyline Trail",
        starVotes: 91,
        stars: 4.8,
        state: "Washington",
        summary: "A popular and easily accessible route, skirting the slopes of Mount Rainier and Paradise Glacier.",
        userImg: "https://cdn2.apstatic.com/photos/hike/7011377_medium_1554559259.jpg"
    },
    {
        ascent: 1493,
        conditionStatus: "Minor Issues",
        county: "Pierce",
        covidStatus: "",
        descent: -1485,
        difficulty: "blueBlack",
        id: 7002140,
        image: "https://cdn2.apstatic.com/photos/hike/7011377_medium_1554559259.jpg",
        latitude: 46.787,
        length: 5.3,
        location: "Eatonville, Washington",
        longitude: -121.735,
        name: "Skyline Trail",
        starVotes: 91,
        stars: 4.8,
        state: "Washington",
        summary: "A popular and easily accessible route, skirting the slopes of Mount Rainier and Paradise Glacier.",
        userImg: "https://cdn2.apstatic.com/photos/hike/7011377_medium_1554559259.jpg"
    },
    {
        ascent: 3281,
        conditionStatus: "All Clear",
        county: "King",
        covidStatus: "",
        descent: -3282,
        difficulty: "blueBlack",
        id: 7001016,
        image: "https://cdn2.apstatic.com/photos/hike/7004228_medium_1554244390.jpg",
        latitude: 47.4882,
        length: 6.6,
        location: "Tanner, Washington",
        longitude: -121.7233,
        name: "Mt. Si",
        starVotes: 110,
        stars: 4.4,
        state: "Washington",
        summary: "A steep, well-maintained trail takes you atop Mt. Si with outrageous views of Puget Sound.",
        userImg: "https://cdn2.apstatic.com/photos/hike/7004228_medium_1554244390.jpg"
    },
    {
        ascent: 370,
        conditionStatus: "All Clear",
        county: "King",
        covidStatus: "",
        descent: -370,
        difficulty: "blue",
        id: 7019080,
        image: "https://cdn2.apstatic.com/photos/hike/7032460_medium_1554933260.jpg",
        latitude: 47.4527,
        length: 2.3,
        location: "Riverbend, Washington",
        longitude: -121.7053,
        name: "Twin Falls",
        starVotes: 68,
        stars: 4.3,
        state: "Washington",
        summary: "A classic family-friendly route through old growth trees with a spectacular waterfall in the mix.",
        userImg: "https://cdn2.apstatic.com/photos/hike/7032460_medium_1554933260.jpg"
    },
    {
        ascent: 1619,
        conditionStatus: "All Clear",
        county: "King",
        covidStatus: "",
        descent: -1618,
        difficulty: "blueBlack",
        id: 7005406,
        image: "https://cdn2.apstatic.com/photos/hike/7004771_medium_1554310760.jpg",
        latitude: 47.4999,
        length: 3.9,
        location: "Issaquah, Washington",
        longitude: -122.0211,
        name: "Poo Poo Point via Chirico Trail",
        starVotes: 67,
        stars: 4.4,
        state: "Washington",
        summary: "A great place for a picnic and watching paragliders!",
        userImg: "https://cdn2.apstatic.com/photos/hike/7004771_medium_1554310760.jpg"
    },
    {
        ascent: 3739,
        conditionStatus: "Unknown",
        county: "Clallam",
        covidStatus: "",
        descent: -3748,
        difficulty: "black",
        id: 7002051,
        image: "https://cdn2.apstatic.com/photos/hike/7001107_medium_1554217677.jpg",
        latitude: 47.9551,
        length: 17.6,
        location: "Forks, Washington",
        longitude: -123.8357,
        name: "High Divide Loop",
        starVotes: 51,
        stars: 4.9,
        state: "Washington",
        summary: "This loop is a superlative experience that you'll be eager to repeat.",
        userImg: "https://cdn2.apstatic.com/photos/hike/7001107_medium_1554217677.jpg"
    },
    {
        ascent: 3848,
        conditionStatus: "All Clear",
        county: "King",
        covidStatus: "",
        descent: -3848,
        difficulty: "black",
        id: 7005408,
        image: "https://cdn2.apstatic.com/photos/hike/7005310_medium_1554311893.jpg",
        latitude: 47.4666,
        length: 9.7,
        location: "Riverbend, Washington",
        longitude: -121.6739,
        name: "Mailbox Peak Trail",
        starVotes: 51,
        stars: 4.5,
        state: "Washington",
        summary: "An infamous (easier) hike with a mailbox (maintained by volunteers) at the top!",
        userImg: "https://cdn2.apstatic.com/photos/hike/7005310_medium_1554311893.jpg"
    },
    {
        ascent: 3873,
        conditionStatus: "Minor Issues",
        county: "Skagit",
        covidStatus: "",
        descent: -3872,
        difficulty: "black",
        id: 7013011,
        image: "https://cdn2.apstatic.com/photos/hike/7023891_medium_1554845849.jpg",
        latitude: 48.4755,
        length: 11.5,
        location: "Stehekin, Washington",
        longitude: -121.075,
        name: "Cascade Pass to Sahale Arm",
        starVotes: 34,
        stars: 5,
        state: "Washington",
        summary: "Climb steadily through endless switchbacks to an awe-inspiring pass with impressive peaks & glaciers",
        userImg: "https://cdn2.apstatic.com/photos/hike/7023891_medium_1554845849.jpg"
    },
    {
        ascent: 2419,
        conditionStatus: "All Clear",
        county: "Snohomish",
        covidStatus: "",
        descent: -2419,
        difficulty: "blue",
        id: 7003986,
        image: "https://cdn2.apstatic.com/photos/hike/7007441_medium_1554322863.jpg",
        latitude: 47.8669,
        length: 11.1,
        location: "Gold Bar, Washington",
        longitude: -121.6779,
        name: "Wallace Falls and Lake",
        starVotes: 48,
        stars: 4.2,
        state: "Washington",
        summary: "A popular trail system with trail access to both Wallace Falls and Wallace Lake.",
        userImg: "https://cdn2.apstatic.com/photos/hike/7007441_medium_1554322863.jpg"
    },
    {
        ascent: 1295,
        conditionStatus: "Unknown",
        county: "Pierce",
        covidStatus: "",
        descent: -1295,
        difficulty: "blueBlack",
        id: 7002181,
        image: "https://cdn2.apstatic.com/photos/hike/7027431_medium_1554916207.jpg",
        latitude: 46.9336,
        length: 5.6,
        location: "Eatonville, Washington",
        longitude: -121.8647,
        name: "Tolmie Peak",
        starVotes: 37,
        stars: 4.7,
        state: "Washington",
        summary: "A manageable out-and-back showcasing multiple lakes and panoramic views from atop Tolmie Peak.",
        userImg: "https://cdn2.apstatic.com/photos/hike/7027431_medium_1554916207.jpg"
    }
];
