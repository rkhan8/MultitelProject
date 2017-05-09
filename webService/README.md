# Simulateur de capteurs 
 * Installer les dépendances du projet
  Se mettre à la racine du projet et faire la commande ``` npm install ```
 * Installer mySQl
 * Creer une base de donnée du nom de ```multitel```
 * Créer un utilisateur avec tous les droits
    > Username: multitel, Password: multitel
 * Lancer le projet
   > La table sensor sera automatiquement créé.<br/>
   > Ajouter les données dans la table sensor ```tous les champs doivent être remplis```.<br/>
   > Pour le champs catégorie mettre ```analog``` ou ```binary```. Ce sont les deux seuls choix valides, tout autre valeur génère une exception.<br/>
   > Une fois les valeurs ajoutées dans la table, le simulateur se met en marche, vous pouvez verifier les valeurs qui sont générer en affichant la console<br/>
* Pour lancer les test
-  Se mettre a la racine du projet
- Faire la commande ``` npm test```
