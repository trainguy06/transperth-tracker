# transperth-tracker
A very simple self-hostable site that slowly tracks trains currently scheduled on the Transperth network.

## How to Install
1. Download the files and pop them into a new folder located somewhere easily accessable via:
   - Command Prompt for Windows
     OR
   - Terminal for MacOS
2. ENSURE you have a version of [Node](https://nodejs.org/en/download) installed on your computer. (I have tested with v18 and Higher)
3. Open the new folder you made in your terminal of choice and initiate the files:
   - [x] `npm init -y` (This creates your package.json instantly)
   - [x] `npm i express node-cron puppeteer` (This will install the dependencies required to run the server)
   - [x] `node .` (This runs the server)

The reason I get you to init and install yourself is because each version of Node uses different versions of dependencies, which can cause some errors in the short-term and kills me long-term. This just eliminates that issue.

Any issues can be reported via the Issues section on GitHub, or you can add my Discord and ask me further questions: `@.trainguy`.

## So how do I use it?
- Right so if you launch it up ([clicking this](http://localhost:3000) should open it up if you haven't changed any code) you will see a simple site with two boxes.
- As the server populates itself with information from the Transperth Website, it will show each station in its respective boxes.
- You can hover over each station to see more detailed information about each station.
- If a C-Series is scheduled to a station (this does not show on TP Journey Planner App or Website) it will have a box next to the station name that says '**[C-Series!]**'. That's your cue to get to your local train station!

## What is the future of Transperth Tracker?
I plan to add a bunch of stuff like:
- [ ] A "signaller-style" UI, where it will show each service on top of each station.
- [ ] Include more symbols if there is a 3-Car service, or maybe a K, W, or C pattern comes up? MAYBE even an Express MAND-PER?
- [ ] Give users a dark or light mode option.
- [ ] Find more backend data from Transperth and integrate it.

## Looks a bit ugly tho...
Yes I 100% understand it looks very ugly at the moment, however, it functions exactly how it should.

## Got ideas?
Send them through to me via Discord and if it's a great idea (and actually do-able) then I will pop it into this README file!

### Check back every so often if you want to see updates that may popup.
Thank you!
