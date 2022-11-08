/* eslint-disable no-unused-expressions */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-undef */
/// <reference types="cypress" />

// Summary: (time: 14s)
// Game ID, No. of players, current round, advance round button, pause round button should all be visible
// Check it sends requests to fetch game data and check responses are in the correct format
// Mock responses and check that it displays the data correctly (data = no. of players, current round, game paused)
// Check advance round and pause game buttons works
// Maybe check questions stop being sent after pause? or new questions are sent after advance? (not sure how to do this)

describe('Game page', () => {
  beforeEach(function () {
    cy.createGame('test')

    // save gameId of created game under alias gameId for tests to use later
    cy.get('[data-cy="game-id"]').invoke('text').as('gameId')

    // Navigate to game admin page
    cy.get('[data-cy="to-game-page"]').click()
  })

  it('initial template', function () {
    cy.url().should('include', this.gameId + '/admin')
    // Check game id is visible
    cy.contains(this.gameId).should('be.visible')
    // Check number of players is zero initially
    cy.get('[data-cy="number-of-players"]').should('have.text', '0')
    // Check current round is set to WARMUP
    cy.get('[data-cy="current-round"]').should('have.text', 'WARMUP')
    // Check pause and advance round buttons are visible
    cy.get('[data-cy="advance-round-button"]').should('be.visible')
    cy.get('[data-cy="pause-round-button"]').should('be.visible')
  })

  it('advance round button', function () {
    cy.url().should('include', this.gameId + '/admin')
    cy.get('[data-cy="current-round"]').should('have.text', 'WARMUP')

    cy.intercept('PUT', '/api/' + this.gameId).as('advance-round')

    // Click advance round button
    cy.get('[data-cy="advance-round-button"]').click()

    // Check request and response
    cy.wait('@advance-round').then(({ request, response }) => {
      expect(request.body).to.deep.equal({ round: 1 })
      expect(response.statusCode).to.equal(200)
      expect(response.body).to.equal('ROUND_INCREMENTED')
    })

    // Check template
    cy.get('[data-cy="current-round"]').should('have.text', 'Round 1')

    // Click advance round again
    cy.get('[data-cy="advance-round-button"]').click()

    // Check request and response
    cy.wait('@advance-round').then(({ request, response }) => {
      expect(request.body).to.deep.equal({ round: 2 })
      expect(response.statusCode).to.equal(200)
      expect(response.body).to.equal('ROUND_INCREMENTED')
    })

    // Check template
    cy.get('[data-cy="current-round"]').should('have.text', 'Round 2')
  })

  it('pause round button', function () {
    cy.url().should('include', this.gameId + '/admin')
    cy.get('[data-cy="current-round"]').should('have.text', 'WARMUP')
    cy.get('[data-cy="pause-round-button"]').should('have.text', 'Pause')

    cy.intercept('PUT', '/api/' + this.gameId).as('pause-round')

    // Click pause button
    cy.get('[data-cy="pause-round-button"]').click()

    // Check request and response
    cy.wait('@pause-round').then(({ request, response }) => {
      expect(request.body).to.deep.equal({ pause: 'p' })
      expect(response.statusCode).to.equal(200)
      expect(response.body).to.equal('GAME_PAUSED')
    })

    // Check template
    cy.get('[data-cy="current-round"]').should('have.text', 'PAUSED')
    cy.get('[data-cy="pause-round-button"]').should('have.text', 'Resume')

    // Click resume
    cy.get('[data-cy="pause-round-button"]').click()

    // Check request and response
    cy.wait('@pause-round').then(({ request, response }) => {
      expect(request.body).to.deep.equal({ pause: '' })
      expect(response.statusCode).to.equal(200)
      expect(response.body).to.equal('GAME_UNPAUSED')
    })

    // Check template
    cy.get('[data-cy="current-round"]').should('have.text', 'WARMUP')
    cy.get('[data-cy="pause-round-button"]').should('have.text', 'Pause')
  })

  it('check requests for admin', function () {
    cy.url().should('include', this.gameId + '/admin')

    // Setup request intercept
    cy.intercept('GET', '/api/' + this.gameId).as('fetch-game')

    // Verify correct request and response
    cy.wait('@fetch-game').then(({ request, response }) => {
      expect(request.body).to.equal('')
      expect(response.statusCode).to.equal(200)
      // Response is not in JSON
      expect(JSON.parse(response.body)).to.have.property('id').and.to.equal(this.gameId)
      expect(JSON.parse(response.body)).to.have.property('round').and.to.equal(0)
      expect(JSON.parse(response.body)).to.have.property('players').and.to.deep.equal([])
      expect(JSON.parse(response.body)).to.have.property('paused').and.to.equal(false)
    })

    cy.wait('@fetch-game').then(({ request, response }) => {
      expect(request.body).to.equal('')
      expect(response.statusCode).to.equal(200)
      // Response is not in JSON
      expect(JSON.parse(response.body)).to.have.property('id').and.to.equal(this.gameId)
      expect(JSON.parse(response.body)).to.have.property('round').and.to.equal(0)
      expect(JSON.parse(response.body)).to.have.property('players').and.to.deep.equal([])
      expect(JSON.parse(response.body)).to.have.property('paused').and.to.equal(false)
    })
  })

  it('check correct data is displayed from a mock response', function () {
    cy.url().should('include', this.gameId + '/admin')

    // Setup request intercept with mock response
    cy.intercept('GET', '/api/' + this.gameId, { fixture: 'new-game.json' }).as('fetch-game')
    cy.wait('@fetch-game')

    // Check correct data is displayed
    cy.contains(this.gameId).should('be.visible')
    cy.get('[data-cy="number-of-players"]').should('have.text', '3')
    cy.get('[data-cy="current-round"]').should('have.text', 'Round 15')
  })
})
