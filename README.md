# Universal DAW controller
This program is a universal controller for any DAW that supports the Mackie Protocol (Steinberg Cubase, Sonar Cakewalk, Ableton, Reaper, etc). The DAW controller is a small WEB server that provides DAW controls in a standard browser (Chrome preferred) on any device within the same network. The program is based on javascript (nodejs) and runs on the same machine where the DAW is installed.  

# Installation procedure
* install nodejs at https://nodejs.org/en/
* download this program (dawcontroller), unzip and open command prompt to the root folder (folder that includes server.js)
* install express by typing: npm install express
* install web sockets by typing: npm install socket.io
* install MIDI by typing: npm install midi (NOTE, you MUST have virtual C and python installed first)

The program requires two virtual MIDI ports. These can be realized with a simple program called loopMIDI
* install loopMIDI: https://www.tobias-erichsen.de/software/loopmidi.html
* run loopMIDI and create two virtual MIDI channels called "DAWIN" and "DAWOUT"

# How to use
In your DAW setup the virtual MIDI channels in the configuration as MACKIE CONTROL interface
* Run server in CMD window by running: node server.js (from the folder that includes server.js)
* Open browser (preferably Chrome) and navigate to http://localhost:3000/ on the same computer to check if control works
* From other devices within the network the DAWcontrol can be reached by navigating to the IP address like this http://192.168.178.62:3000/

# Notes:
Please use this program only within your LAN network. 

