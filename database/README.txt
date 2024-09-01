Setting up MariaDB to work with this application:
1. Install MariaDB
    sudo apt install mariadb-server
2. Configure for lower-case table names
    sudo vi /etc/mysql/mariadb.conf.d/50-server.cnf
    Under [mariadb] add the following:
    lower_case_table_names=1
3. Start the server, and check it's running
    sudo /etc/init.d/mariadb start
    sudo /etc/init.d/mariadb status
4. Create an admin user with no password, and all permissions
    sudo mysql
    CREATE USER 'admin'@'localhost' IDENTIFIED BY '';
    GRANT ALL PRIVILEGES ON *.* TO admin@localhost WITH GRANT OPTION;

You should now be able to run the following command to instantiate the database:
    node database/deploy.js steps
and, if desired, add sample data:
    node database/deploySample.js steps


