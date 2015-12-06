# Trext - What's Next?
#####CS316, Fall 2015

*Arihant Jain* <br>
*Catherine Zhang* <br>
*Tze-Kang Ng* <br>
*Will Chang* <br>

**Purpose & Features** <br>
Trext is a web application that help travelers plan their travel itineraries better, faster, and more conveniently.
It is developed via a Python Flask server, PostgreSQL database, with AngularJS+Bootstrap for client-side rendering.
Notable features:

> 1. <b>"Plan"</b> - The process of finding one's ideal trip is the following: the user can specify destinations of
        his desire, and/or general location(s) along with general areas of interest and activities. For the lazy or adventurous
         traveler, we can also random these parameters for this search. Our algorithm uses the Yelp API to help us propose
         an itinerary for user. The user can then refine this itinerary by fitting the best routes between the attractions,
         deleting undesired attractions, or re-search using different parameters.

> 2. <b>"Trips"</b> - Once a registered user is pleased with a proposed itinerary, he can save the itinerary trip into his
        list of trips, with a optional travel date. He can also share an itinerary with his friends and family via our
        email sharing feature.

> 3. <b>"Explore"</b> - This is a views page that contains the Editor's Picks -- our favourite themed trips for popular
        destinations. In the future, we can also implement views of popular user-created trips.

**The Stack** <br>

> 1. <b>"Back-End"</b> - We chose to use Python Flask for server-side rendering. We used a PostgreSQL database to
        store users and saved trips information and is currently run locally. The back-end uses the Yelp API for our
        search algorithm and the Python smtplib module for emailing itineraries.

> 2. <b>"Front-End"</b> - AngularJS + BootStrap, with Angular-Material-inspired UI components, was used for client-side
        rendering. The Google Maps API was used to display routes for our proposed itineraries.

**Future Plans** <br>

> 1. <b>":)"</b>

> 2. <b>":)"</b>
