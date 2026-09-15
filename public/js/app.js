import { validateMessage,replyTo } from './brain.js';
import { renderMessages } from './view.js';

const formulaire = document.querySelector('#chat-form');
const statut = document.querySelector('#status');
// const versionElt = document.querySelector('#version');

// Ceci correspond au label
const message = document.querySelector('#message');
// Ceci correspond à la liste des messages
const messages = document.querySelector('#messages');

// Ceci correspond au compteur de cractères
const compteur = document.querySelector('#compteur');

// Ceci est l'historique des messages utilisateur et chatbot
const historique = []

//Ceci est le bouton pour effacer la conversation
const effacer = document.querySelector('#effacer');

//Ceci est l'historiqeu sauvegardé
const historique_sauvegarde = localStorage.getItem('capweb.historique')

if(historique_sauvegarde){
  try{
    const donne = JSON.parse(historique_sauvegarde)
    historique.push(...donne)
    renderMessages(historique, messages)
  }catch(erreur){
    historique.length = 0
    statut.textContent = "La conversation sauvegardée est invalide. Une nouvelle conversation a été créée."
  }
}

effacer?.addEventListener('click', () => {
  if(confirm("Voulez-vous vraiment effacer la conversation ?")){
    historique.length = 0
    localStorage.removeItem('capweb.historique')
    renderMessages(historique, messages)
    statut.textContent = "La conversation a été effacée."
  }
})

// J1 : interface seule, on bloque l’envoi et on l’explique.
formulaire?.addEventListener(`submit`, (event) => {
  event.preventDefault();
  const validation = validateMessage(message.value)
  if(validation.ok === false){
    statut.textContent = validation.error
    message.focus()
    return
  }else{
      const message_envoye = validation.value
      const reponse = replyTo(message_envoye)
      historique.push({ role: 'user', content: message_envoye })
      historique.push({ role: 'assistant', content: reponse })
      localStorage.setItem('capweb.historique',JSON.stringify(historique))
      renderMessages(historique, messages)
      // Remise à zéro du formulaire
      message.value = ''
      statut.textContent = ''
      compteur.textContent = '0 / 280'
      message.focus()
  }
});

message.addEventListener('input',() =>{
  compteur.textContent = `${message.value.length} / 280`
})


// Version du serveur local, échec discret si indisponible.
// fetch('/version.json', { headers: { accept: 'application/json' } })
//   .then((reponse) => (reponse.ok ? reponse.json() : null))
//   .then((donnees) => {
//     if (donnees && typeof donnees.version === 'string' && versionElt) {
//       versionElt.textContent = `version ${donnees.version}`;
//     }
//   })
//   .catch(() => {});
