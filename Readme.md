To run the application in cloud, please go to this url - https://debjyoti-twitter-application.herokuapp.com/

To run in local setup with database (mongodb) also in local, please follow the following steps - 
      -   clone this repository (https://github.com/Sachinists/twitter-app.git)
      -   In config/dev.env, change the property DB_URL as per your local mongodb connection endpoint.
      -   From the base location of your cloned repo (at the level where Readme, src, package.json are of same level) RUN the command : npm install
      -   Then, when its done! RUN : npm run dev (from the same place)

To seperately run the UI with, database hosted in cloud - 
      -   Clone this repository (https://github.com/Sachinists/twitter-app-frontend.git)
      -   After cloning, RUN the command : npm install
      -   Followed by : mg serve -- o


Prerequisite - 
      -   Node Version > 10
      -   MongoDB