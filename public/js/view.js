export function renderMessages(messages, container){
    const lignes = messages.map(message => {
        const li = document.createElement('li')
        if(message.role === 'user'){
            li.dataset.role = "user";
            li.textContent = `Vous : ${message.content}`
        }else if(message.role === 'assistant'){
            li.dataset.role = "assistant";
            li.textContent = `Cap Web : ${message.content}`
        }
        return li
    })
    container.replaceChildren(...lignes);
}