# Kitchen Garden Planner

## Adding more public beds
* To add the rest of the public beds, create them and submit under
the email: `public@gardeners.com` and zip: `55555`
* To add the info link, go to the database and find the document for the bed. add an `"info"` attribute to the object, with the value being the link to the page on gardeners. example below
  - ```"info": "{insert your link}"```


## Known bugs
* When you switch to the garden planner and then back to the bed planner, if you try to expand the size of the bed, crops will disappear from the bed in the expanded slots
* Theres a feature on apiSaveBed and apiSaveGarden in their respective controllers to stop users from submitting beds or gardens with duplicate names. It worked before, but it doesnt seem to work now. Probably something small

## Seed Counter
* Adding a seed counter was brought up in a meeting. Unfortnately, I wont have time to implement it fully. I began by adding the number of seed per square foot as an attribute in the Guide object in ```frontend/src/assets/guide.js``` If you wanted to implement this feature, all you would have to do would be to loop through each bed in the garden, each crop in that bed, and count how many total crops of that type youve planted. then just multiply by the number of seeds to plant. 