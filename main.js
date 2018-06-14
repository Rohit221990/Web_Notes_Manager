const electron = require("electron");
const url = require("url");
const path = require("path");

const {app, BrowserWindow, Menu, ipcMain} = electron;  

// Process.env

process.env.Node_ENV = 'production'

let mainWindow;
let addWindow;

//listen for app to be ready

app.on('ready', function(){
    //crate a new window
    mainWindow = new BrowserWindow({});

    //load the html file into the window
    mainWindow.loadURL(url.format({
        pathname:path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }))

    mainWindow.on('closed', function(){
        app.quit();
    })
    

    //Build menu from app
    const mainMenu = Menu.buildFromTemplate(mainMenTemplate);

    //Insert Menu
    Menu.setApplicationMenu(mainMenu);

})


//Handle create add window
function createAddWindow(){
    addWindow = new BrowserWindow({
        width: 400,
        height: 200, 
        frame: false,
        title: "add website address URL"

    });
    
    addWindow.on('close', function(){
        addWindow = null;
    })
    //load the html file into the window
    addWindow.loadURL(url.format({
        pathname:path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }))

}


//catch item:add
ipcMain.on('item:add', function(e, item){
    mainWindow.webContents.send('item:add',item);
    addWindow.close();
})

// Create Menu template
const mainMenTemplate = [
    {
        label: 'File',
        submenu:[
            {
                label : 'Add Item',
                click(){
                    createAddWindow()
                }
            },
            {
                label : 'Clear Item',
                click(){
                    mainWindow.webContents.send('item:clear')
                }
            },
            {
                label : 'Quit',
                accelerator : process.platform == 'drawin'? 'Command+Q': 'Ctrl+Q',            
                click(){
                    app.quit();
                } 
            }
        ]
    }
];

if(process.platform == 'darwin'){
    mainMenTemplate.unshift()
}

if(process.env.Node_ENV !== 'production'){
    mainMenTemplate.push({
        label : 'Developer Tools',
        submenu:[{
            label: 'Toggle DevTools',
            accelerator: process.platform ==  'drawin'? 'Command+Q': 'Ctrl+Q',
            click(item, focusedWindow){
                focusedWindow.toggleDevTools();
            } 
        },{
            role: 'reload'
        }
        ]
    });
}