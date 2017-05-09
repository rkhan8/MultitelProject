# Multitel Signaux WebService 
 * Installer les dépendances du projet
  Se mettre à la racine du projet et faire la commande ``` npm install ```
 * Installer mySQl
 * Creer une base de donnée du nom de ```multitel```
 * Créer un utilisateur avec tous les droits
    > Username: multitel, Password: multitel
 * Lancer le projet
   > Toutes les tables seront automatiquement créé.<br/>
   > Ajouter les données dans la table batiment. Il est important remplir les champs ```Compagnie```, ```Nombatiment```,```NbEtages``` .<br/>
   > Suivre les instructions de configuration et du simulateur capteur et laisser le simulateur en marche.<br/>
   > Lancer ou Re-lancer le webService<br/>
   > Les valeurs du simulateur sont recupérées par le webService et sont enregistrée dans la BD, afficher la console du webService pour voir la trace des données
   > Ouvrir son navigateur internet (Chrome de préférence) et aller a l'adresse http://localhost:3000 
* Pour lancer les tests
   >  Se mettre a la racine du projet <br/>
   > Faire la commande ``` npm test```
