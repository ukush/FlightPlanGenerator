Flight Plan Coordinate Script Generator
-

This app is contained within a httpd docker container which runs an Apache HTTP server.
To run this application as intended, you'll need to build and run the docker image. 


Build the Image
-

``docker build -t flightplan .``

This will use the Dockerfile to build a docker image and tag it with the name flightplan. It will download the httpd container and copy all the files from the application directory to the container.

You can check the image has been built by running:

``docker images``

To see that 'flightplan' is  visible


Create a running container from this image
-

``docker run -it -p 8080:80 --name flightplan flightplan``

This creates a running container in the background and binds port 80 of the host container to port 8080 on 127.0.0.1:8080 of the host machine.

To ensure the container is running, run:
``docker ps``

Visit the website
-

To visit the site locally, simple navigate to `127.0.0.1:8080`