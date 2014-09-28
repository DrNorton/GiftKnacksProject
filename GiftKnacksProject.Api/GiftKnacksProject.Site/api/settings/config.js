exports.config = {
    user: 'DrNorton@l4gy0u90b0',
    password: 'Rianon1990',
    server: 'l4gy0u90b0.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
    database: 'littleplace_db',
  
    connectionString: "Driver={SQL Server Native Client 11.0};Server=tcp:l4gy0u90b0.database.windows.net,1433;Database=littleplace_db;Uid=DrNorton@l4gy0u90b0;Pwd=Rianon1990",
    url: 'http://littleplace.azurewebsites.net/',
    options: {
        encrypt: true // Use this if you're on Windows Azure
    }

}