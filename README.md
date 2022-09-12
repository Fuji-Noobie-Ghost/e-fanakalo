# E-fanakalo

## #techzara_wcc2

## All things you need to do

* Start your PostgreSQL service and create a new database 
    ```bash
    CREATE DATABASE <your_database_name>;
    ```

* Edit .env files in your project root according to your environment
    
* In your terminal, run the following command
    ```bash
    npm install
    npm run migration:run # Create all Tables
    ```
* Create a directory 'uploads' in the project root
    ```bash
    mkdir uploads
    ```
* Finally, you can run the API with the following command
   ```bash
    npm start
    ```

### This are a list of request you can test

| <center>Method</center> | <center>URI</center> |<center>Description</center> |
|--------|-----|-------------|
| GET    | /   | <b>action:</b> return all exchanges<br><b>pagination:</b> without pagination system<br><b>accept query:</b> status(active or deactive)
| GET    | /exchanges | <b>action:</b> return all exchanges<br><b>pagination:</b> with pagination<br><b>accept query:</b> page(number), per_page(number), status(active or deactive), sort(username or title or createdAt or updatedAt)<br><b>default value:</b> page=1, per_page=10, sort=updatedAt
| POST   | /   | <b>action:</b> create a new exchange<br><b>payload:</b> username(string), contact(string), title(string), searchFor(text as string), photos(list of images)<br><b>return:</b> the current data pass to the database
| PUT    | /activate | <b>action:</b> set an exchange to active mode<br><b>query params needed:</b> the exchanges id(string)
| PUT    | /deactivate | <b>action:</b> set an exchange to deactive mode<br><b>query params needed:</b> the exchanges id(string)

## <center>Have a nice Day :)</center>
