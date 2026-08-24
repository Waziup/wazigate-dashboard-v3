# Walkthrough
This are steps on how to replace the running new on wazigate with the new UI

## Installation
1. clone the repo from github `git clone https://github.com/Waziup/wazigate-dashboard-v3\`
2. `cd wazigate-dashboard-v3`
3. `npm install --force`

After all the dependencies are installed we proceed

## Build the project
Insde the repo of wazigate, we build the UI
```bash
    npm run build --force --reset-cache
```
A dist folder will be generated. If you are on linux we can zip the folder.
```bash
    zip -r dist.zip dist/
```
 If you are on window, use Windows Explorer or WinRAR to compress/zip the folder and generate a ``dist.zip`` file

## Move it to wazigate
After successfully zipping the folder, we now move it to the wazigate. 

> **NOTE** 
>
> Ensure you have a running wazigate that has the current UI running and the ISO installed and running correctly on the wazigate
>
> If not so, do so before we proceed

Now, we copy the ``dist.zip`` file to the wazigate using ``scp``
```sh
    scp dist.zip pi@wazigate.local:~/
```
After it is moved successfully to the wazigate, we now ssh to wazigate
```sh
    ssh pi@wazigate.local
```

Inside the root directory you will see a ``dist.zip file`` Now we unzip the file
```sh
    $ unzip dist.zip
```
A dist folder will be generate. You can inspect the contents of the folder by moving into the folder
```sh
    $ cd dist && ls
```
Now, the current UI has everything running in the ``/var/lib/wazigate/www``. You can go to that directory
by typing 
```sh 
    $ cd /var/lib/wazigate/www
```
Because we are replacing the UI, remove the index.html file and all images in the folder and its folder by typing
```sh
    $ sudo rm -r [OPTIONS]
```
In the options specify the files to be removed.
Now navigate to root directory
```sh
    $ cd ~
```
Now we copy all the items in the dist folder to the ``/var/lib/wazigate/www`` folder
```sh
    $ sudo cp -r dist/assets dist/*.svg dist/index.html /var/lib/wazigate/www
```
Now here if they are copied successfully you can go into the folder and inspect them
```sh 
    $ cd /var/lib/wazigate/www
    $ ls
```
Now we are done, to ensure everything is working correctly, go to your browser and type ``wazigate.local``.
You should see the new UI