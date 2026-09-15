import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateMessage, replyTo } from '../public/js/brain.js';

describe('validateMessage', () => {
    it('refuser une chaine vide',() => {
        assert.equal(validateMessage('').ok,false)
    })
    it("nettoie les espaces autour d'une chaine",() => {
        assert.deepEqual(validateMessage('  bonjour  '),{ok:true, value:'bonjour'})
    })
    it('refuser une chaine de plus de 280 caractères',() => {
        assert.equal(validateMessage('a'.repeat(281)).ok,false)
    })
    it('accepter une chaine de 280 caractères', () => {
        assert.equal(validateMessage('a'.repeat(280)).ok,true)
    })
})

describe('replyTo', () => {
    it('repond a bonjour', () => {
        assert.equal(replyTo('bonjour'),'Bonjour')
    })
    it('ne repond pas a une phrase inconnue', () => {
        assert.equal(replyTo('inconnu'),'Je ne comprends pas votre message')
    })
    it('ne repond pas a une phrase inconnue 2', () => {
        assert.equal(replyTo('aide'),'Je ne comprends pas votre message')
    })
})