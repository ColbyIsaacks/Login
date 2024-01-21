const express = require('express')
const {Pool} = require('pg')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = 5000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

app.get('/login', (req, res) => {
    console.log("hello world")
  res.send('Hello World!')
})

app.post('/login', async (req, res) => {
    // Access the body of the POST request
    const formData = req.body;
  
    // Print out the body
    console.log('Received POST request with body:', formData);
  
    // Handle the data as needed
    const username = formData.username
    const password = formData.password
    const query = `SELECT * FROM testdb_login WHERE username = '${ username }' AND password = '${ password }';`
    const response = await pool.query(query);
    console.log(response.rows);

    if(response.rows.length != 0){
        res.status(200).send('POST request received');
    }
    else{
        res.status(403).send('Invalid Login');
    }
  });

app.post('/register', async (req, res) => {
    const formData = req.body;

    console.log('Received POST request with body:', formData);

    const username = formData.username
    const password = formData.password
    const prequery = `SELECT * FROM testdb_login WHERE username = '${ username }';`
    const preresponse = await pool.query(prequery);
    console.log(preresponse.rowCount);
    if(username.length > 3 && password.length > 5 && preresponse.rowCount == 0){
        const query = `INSERT INTO testdb_login (username, password) VALUES ('${username}', '${password}')`;
        const response = await pool.query(query);
        res.status(200).send('Profile successfully created');
    }
    else{
        res.status(403).send('Invalid Login');
    }
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'login',
    password: 'Crowley71498!',
    port: 5432,
  })

console.log("Testing connection")
const conntest = async () => {
    console.log((await pool.query('SELECT * FROM testdb_login')).rows)
}
conntest()