import express from "express";
import bodyParser from "body-parser";
import cors from "cors"; // 引入 cors 中間件
import mongoose from "mongoose";
import https from "https";

import { setAdminRoutes } from "./routes/adminRoutes"; // Import admin routes
import { setAuthRoutes } from "./routes/authRoutes";
import { User } from "./models/User";
import { Admin } from "./models/Admin";
import { Location } from "./models/Location";
import { Event } from "./models/Event";
import { users } from "./data/Users";

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors()); // 使用 cors 中間件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/project');
const db = mongoose.connection;
db.on('error',console.error.bind(console, 'Connection error:'));
db.once('open', function(){
  console.log('Connected to MongoDB');

  async function insertUserData(){
    try{
      await User.deleteMany({});
      const docs = await User.insertMany(users);
      console.log(`Inserted ${docs.length} users:`);
    }catch(err){
      console.error('Error inserting users:', err);
    }
  }

  // Fetch and store location data
  async function fetchAndStoreLocationData() {
    const url = 'https://www.lcsd.gov.hk/datagovhk/event/venues.xml';
    //console.log('Fetching location data from:', url);
    https.get(url, (res: any) => {
      let xmlData = '';
      res.on('data', (chunk: any) => {
        xmlData += chunk;
      });
      res.on('end', async () => {
        //console.log('Fetched XML Data:', xmlData);
        const locationsData: { venueId: string; venueName: string; latitude: string; longitude: string }[] = [];
        const venues = xmlData.match(/<venue id=".*?">[\s\S]*?<\/venue>/g); // Adjusted regex to match newlines
        //console.log('Matched Venues:', venues); // Log the matched venues
        if (venues) {
          venues.forEach((venue: string) => {
            //console.log('Venue Block:', venue); // Log each venue block
            const venueIdMatch = venue.match(/<venue id="(.*?)">/);
            const venueNameMatch = venue.match(/<venuee><!\[CDATA\[(.*?)\]\]><\/venuee>/);
            const latitudeMatch = venue.match(/<latitude><!\[CDATA\[(.*?)\]\]><\/latitude>/);
            const longitudeMatch = venue.match(/<longitude><!\[CDATA\[(.*?)\]\]><\/longitude>/);
  
            const venueId = venueIdMatch ? venueIdMatch[1] : '';
            const venueName = venueNameMatch ? venueNameMatch[1] : '';
            const latitude = latitudeMatch ? latitudeMatch[1] : '';
            const longitude = longitudeMatch ? longitudeMatch[1] : '';
  
            locationsData.push({
              venueId,
              venueName,
              latitude,
              longitude,
            });
          });
  
          // Store locations data in MongoDB
          try {
            await Location.deleteMany({});
            const docs = await Location.insertMany(locationsData);
            console.log(`Inserted ${docs.length} locations:`);
          } catch (err) {
            console.error('Error inserting locations:', err);
          }
        } else {
          console.log('No venues found in the fetched location data');
        }
      });
    }).on('error', (e: any) => {
      console.error(`Problem with request: ${e.message}`);
    });
  }
  // Fetch and store event data
  async function fetchAndStoreEventData() {
    const url = 'https://www.lcsd.gov.hk/datagovhk/event/events.xml';
    https.get(url, (res) => {
        let xmlData = '';
        res.on('data', (chunk) => {
            xmlData += chunk;
        });
        res.on('end', async () => {
            try {
                const eventsData: {
                    eventId: string;
                    titleE: string;
                    cat1: string;
                    cat2: string;
                    predateE: string;
                    progtimeE: string;
                    venueId: string;
                    ageLimitE: string;
                    priceE: string;
                    descE: string;
                    urlE: string;
                    tagentUrlE: string;
                    remarkE: string;
                    enquiry: string;
                    saleDate: string;
                    interBook: string;
                    presenterOrgE: string;
                    progImage: string;
                    detailImage1: string;
                    detailImage2: string;
                    detailImage3: string;
                    detailImage4: string;
                    detailImage5: string;
                    videoLink: string;
                    video2Link: string;
                    submitDate: string;
                }[] = [];
                const events = xmlData.match(/<event id=".*?">[\s\S]*?<\/event>/g);
                if (events) {
                    for (const event of events) {
                        const eventIdMatch = event.match(/<event id="(.*?)">/);
                        const titleEMatch = event.match(/<titlee><!\[CDATA\[(.*?)\]\]><\/titlee>/);
                        const cat1Match = event.match(/<cat1><!\[CDATA\[(.*?)\]\]><\/cat1>/);
                        const cat2Match = event.match(/<cat2><!\[CDATA\[(.*?)\]\]><\/cat2>/);
                        const predateEMatch = event.match(/<predateE><!\[CDATA\[(.*?)\]\]><\/predateE>/);
                        const progtimeEMatch = event.match(/<progtimee><!\[CDATA\[(.*?)\]\]><\/progtimee>/);
                        const venueIdMatch = event.match(/<venueid><!\[CDATA\[(.*?)\]\]><\/venueid>/);
                        const ageLimitEMatch = event.match(/<agelimite><!\[CDATA\[(.*?)\]\]><\/agelimite>/);
                        const priceEMatch = event.match(/<pricee><!\[CDATA\[(.*?)\]\]><\/pricee>/);
                        const descEMatch = event.match(/<desce><!\[CDATA\[(.*?)\]\]><\/desce>/);
                        const urlEMatch = event.match(/<urle><!\[CDATA\[(.*?)\]\]><\/urle>/);
                        const tagentUrlEMatch = event.match(/<tagenturle><!\[CDATA\[(.*?)\]\]><\/tagenturle>/);
                        const remarkEMatch = event.match(/<remarke><!\[CDATA\[(.*?)\]\]><\/remarke>/);
                        const enquiryMatch = event.match(/<enquiry><!\[CDATA\[(.*?)\]\]><\/enquiry>/);
                        const saleDateMatch = event.match(/<saledate><!\[CDATA\[(.*?)\]\]><\/saledate>/);
                        const interBookMatch = event.match(/<interbook><!\[CDATA\[(.*?)\]\]><\/interbook>/);
                        const presenterOrgEMatch = event.match(/<presenterorge><!\[CDATA\[(.*?)\]\]><\/presenterorge>/);
                        const progImageMatch = event.match(/<prog_image><!\[CDATA\[(.*?)\]\]><\/prog_image>/);
                        const detailImage1Match = event.match(/<detail_image1><!\[CDATA\[(.*?)\]\]><\/detail_image1>/);
                        const detailImage2Match = event.match(/<detail_image2><!\[CDATA\[(.*?)\]\]><\/detail_image2>/);
                        const detailImage3Match = event.match(/<detail_image3><!\[CDATA\[(.*?)\]\]><\/detail_image3>/);
                        const detailImage4Match = event.match(/<detail_image4><!\[CDATA\[(.*?)\]\]><\/detail_image4>/);
                        const detailImage5Match = event.match(/<detail_image5><!\[CDATA\[(.*?)\]\]><\/detail_image5>/);
                        const videoLinkMatch = event.match(/<video_link><!\[CDATA\[(.*?)\]\]><\/video_link>/);
                        const video2LinkMatch = event.match(/<video2_link><!\[CDATA\[(.*?)\]\]><\/video2_link>/);
                        const submitDateMatch = event.match(/<submitdate><!\[CDATA\[(.*?)\]\]><\/submitdate>/);

                        const eventId = eventIdMatch ? eventIdMatch[1] : '';
                        const titleE = titleEMatch ? titleEMatch[1] : '';
                        const cat1 = cat1Match ? cat1Match[1] : '';
                        const cat2 = cat2Match ? cat2Match[1] : '';
                        const predateE = predateEMatch ? predateEMatch[1] : '';
                        const progtimeE = progtimeEMatch ? progtimeEMatch[1] : '';
                        const venueId = venueIdMatch ? venueIdMatch[1] : '';
                        const ageLimitE = ageLimitEMatch ? ageLimitEMatch[1] : '';
                        const priceE = priceEMatch ? priceEMatch[1] : '';
                        const descE = descEMatch ? descEMatch[1] : '';
                        const urlE = urlEMatch ? urlEMatch[1] : '';
                        const tagentUrlE = tagentUrlEMatch ? tagentUrlEMatch[1] : '';
                        const remarkE = remarkEMatch ? remarkEMatch[1] : '';
                        const enquiry = enquiryMatch ? enquiryMatch[1] : '';
                        const saleDate = saleDateMatch ? saleDateMatch[1] : '';
                        const interBook = interBookMatch ? interBookMatch[1] : '';
                        const presenterOrgE = presenterOrgEMatch ? presenterOrgEMatch[1] : '';
                        const progImage = progImageMatch ? progImageMatch[1] : '';
                        const detailImage1 = detailImage1Match ? detailImage1Match[1] : '';
                        const detailImage2 = detailImage2Match ? detailImage2Match[1] : '';
                        const detailImage3 = detailImage3Match ? detailImage3Match[1] : '';
                        const detailImage4 = detailImage4Match ? detailImage4Match[1] : '';
                        const detailImage5 = detailImage5Match ? detailImage5Match[1] : '';
                        const videoLink = videoLinkMatch ? videoLinkMatch[1] : '';
                        const video2Link = video2LinkMatch ? video2LinkMatch[1] : '';
                        const submitDate = submitDateMatch ? submitDateMatch[1] : '';

                        eventsData.push({
                            eventId,
                            titleE,
                            cat1,
                            cat2,
                            predateE,
                            progtimeE,
                            venueId,
                            ageLimitE,
                            priceE,
                            descE,
                            urlE,
                            tagentUrlE,
                            remarkE,
                            enquiry,
                            saleDate,
                            interBook,
                            presenterOrgE,
                            progImage,
                            detailImage1,
                            detailImage2,
                            detailImage3,
                            detailImage4,
                            detailImage5,
                            videoLink,
                            video2Link,
                            submitDate
                        });
                    }

                    // Store events data in MongoDB
                    await Event.deleteMany({});
                    const docs = await Event.insertMany(eventsData);
                    console.log(`Inserted ${docs.length} events:`);
                } else {
                    console.log('No events found in the fetched event data');
                }
            } catch (err) {
                console.error('Error processing event data:', err);
            }
        });
    }).on('error', (err) => {
        console.error('Error fetching data:', err);
    });
  }

  async function fetchData() {
    await insertUserData();
    await fetchAndStoreLocationData();
    await fetchAndStoreEventData();
  }
  console.log("Fetching and storing data...");
  fetchData(); // Call the function to fetch and store data
  setAuthRoutes(app);
  setAdminRoutes(app); // Set up admin routes
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});


