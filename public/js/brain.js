export function validateMessage(raw){
    if(typeof raw !== 'string'){
        return { ok: false, error: "Le message n'est pas une chaine de caractère" }
    }else if(raw.trim().length <= 0){
        return { ok: false, error: "Le message est vide" }
    }else if(raw.length > 280){
        return { ok: false, error: "Le message fait plus de 280 caractères" }
    }
    return { ok: true, value: raw.trim() }
}

export function replyTo(message){
    const reponse_prise_en_compte = ["bonjour","salut","aide","test"]
    const message_donne = message.trim().toLowerCase()
    if(message_donne === 'bonjour' || message_donne === 'salut'){
        return 'Bonjour'
    }else if(message_donne === 'aide'){
        return `Pour l'instant je peux repondre à ces message : ${reponse_prise_en_compte.join(', ')} en minuscule ou majuscule`
    }else if(message_donne === 'test'){
        return 'Test réussi'
    }
    return 'Je ne comprends pas votre message'
}