/* eslint-disable no-undef */
/// <reference types="cypress" />

const text =
  'this is a simple paragraph that is meant to be nice and easy to type which is why there will be commas no periods or any capital letters so i guess this means that it cannot really be considered a paragraph but just a series of run on sentences this should help you get faster at typing as im trying not to use too many difficult words in it.'

describe('Test Typing Speed App', () => {
  before(() => {
    cy.visit('localhost:3000')
  })

  it('Load application', () => {
    cy.get('#root').should('exist')
  })

  it('Start button is enabled and textarea is disabled initially', () => {
    cy.get('textarea').should('be.disabled')
    cy.contains('start').should('be.enabled')
  })

  it('Start button initiates the test and disables itself', () => {
    cy.contains('start').click()
    cy.contains('start').should('be.disabled')
    cy.get('textarea').should('not.be.disabled')
  })

  it('Typing words correctly & pressing space btn should highlight the next word', () => {
    cy.get('textarea').type('this ')
    cy.get('.typing_container__test > span:nth-child(2)').should('have.class', 'hightlight')
  })

  it('Typing words incorrectly & pressing space btn should highlight the word that was typed wrong', () => {
    cy.get('textarea').clear()
    cy.get('textarea').type('this that ')
    cy.get('.typing_container__test > span:nth-child(2)').should('have.class', 'hightlight__red')
  })

  it('Typing texts inside textarea should increase wpm', () => {
    cy.get('textarea').clear()
    cy.get('textarea').type('this is a simple paragraph that is meant to be nice and easy')
    cy.get('.typing_container__speed strong').should('not.contain.text', '0')
  })

  it('Typing texts inside textarea should increase accuracy', () => {
    cy.get('textarea').clear()
    cy.get('textarea').type('this is a simple paragraph that is meant to be nice and easy')
    cy.get('.typing_container__accuracy strong').should('not.contain.text', '0')
  })

  it('Typing a few nonsensical words should display a modal to warn users', () => {
    cy.get('textarea').clear()
    cy.get('textarea').type('jdfkdjfkdjf fkjdfkjdfkjdkf fkjdfkjdfkdkfj fkdjfkjdfkjdfkjd ')
    cy.contains('Please focus on your accuracy and try again').should('exist')
  })

  it('Clicking go back button should close the modal', () => {
    cy.contains('Go back').click()
    cy.get('.overlay').should('be.hidden')
  })

  it('Exhausting the given text within given time should open a modal to congratulate users', () => {
    cy.contains('start').click()
    cy.get('textarea').type(text, { delay: 1 })
    cy.contains(`Congrats! You're a legend!`).should('exist')
  })
})
