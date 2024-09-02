const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

let vehicles = [];
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});


app.post('/data', (req, res) =>{
    
    const {code,hour} = req.body;

    if(exist(vehicles, code, hour)){
        console.log("el vehiculo fue actualizado")
        console.log(vehicles);
        res.send("2");
    }else{
        vehicles.push({code:code,hour:hour,edits:0});
        console.log("El vehiculo fue agregado")
        console.log(vehicles);
        res.send("1");
    }
})

app.get('/search/:code', (req, res) => {
    const code = req.params.code;
    const vehicle = vehicles.find(v => v.code === code);

    if (vehicle) {
        res.json({ found: true, vehicle });
    } else {
        res.json({ found: false });
    }
});


app.delete('/delete/:code', (req, res) => {
    const code = req.params.code;
    const index = vehicles.findIndex(v => v.code === code);

    if (index !== -1) {
        vehicles.splice(index, 1);
        console.log("El Transmilenio fue eliminado");
        res.send("eliminado");
    } else {
        res.send("no existe el bus");
    }
});

function exist (array, code, hour) {
    for (let i = 0; i < array.length; i++) {
        vehicle = array[i];
        if(vehicle.code == code){
            array.splice(i,1);
            vehicle.hour = hour;
            array.push(vehicle);
            vehicle.edits++;
            return true
        }
    }
    return false;
}

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});


