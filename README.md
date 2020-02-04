<p align="center">
    <a target="_blank" href="https://cas.umontpellier.fr/cas/login?service=https://ent.umontpellier.fr/uPortal/Login" alt="logo umontpellier">
        <img src="https://upload.wikimedia.org/wikipedia/fr/2/2d/Logo_universit%C3%A9_montpellier.png" width="50" height="50"></a>
    <a target="_blank" href="https://trello.com/b/BCN5lHZe/wargame" alt="trello">
    	<img src="https://image.flaticon.com/icons/svg/732/732252.svg" width="50" height="50"></a>
    <a target="_blank" href="https://github.com/GraciaMoulisKevin/Wargame/blob/master/enonce.pdf" alt="enonce">
    	<img src="https://image.flaticon.com/icons/svg/136/136522.svg" width="50" height="50"></a>
</p>

# Wargame

## Installer l'environnement de développement

### NodeJS

Le développement de *Dordighol* requiert NodeJS **v12.14.1**.

Ubuntu
---
```bash
sudo apt update
sudo apt -y upgrade
sudo apt update
sudo apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt -y install nodejs
sudo apt -y  install gcc g++ make
```
Windows
---
Utiliser les liens de téléchargement à partir du [site officiel](https://nodejs.org/en/download/).

---

Cloner ce répertoire git et mettre à jour les dépendances
```bash
git clone git@github.com:GraciaMoulisKevin/Wargame.git
cd Wargame/
npm install
```

# Start
```bash
npm run dev
```