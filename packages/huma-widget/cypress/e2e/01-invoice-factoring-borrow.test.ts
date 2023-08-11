import '@testing-library/cypress/add-commands'
import 'cypress-iframe'

import {
  addressForTx,
  INVOICE_AMOUNT,
  INVOICE_FACTORED_AMOUNT,
  INVOICE_FEES,
  ONE_MINUTE,
  TWO_MINUTES,
} from '../utils'

describe('Invoice factoring recurring borrow', () => {
  it('Create RN request', () => {
    cy.visit(Cypress.env('E2E_TEST_RN_CREATE_BASE_URL'))
    cy.findByText('Metamask', { timeout: ONE_MINUTE }).click()
    cy.get('input[name="amount"]').type(String(INVOICE_AMOUNT))
    cy.get('input[name="payer"]').type(addressForTx)
    cy.get('button').contains('Create a request').click()
    cy.findAllByText('Request for payment from', {
      timeout: TWO_MINUTES,
    }).should('exist')
  })

  it('Should get paid 80 USDC for an invoice factoring of 100 USDC value', () => {
    cy.visit('/')
    cy.findByText('InvoiceFactoringBorrow', { timeout: ONE_MINUTE }).click()
    const receivedUSDC = INVOICE_FACTORED_AMOUNT - INVOICE_FEES
    const remainedUSDC = INVOICE_AMOUNT - INVOICE_FACTORED_AMOUNT
    const chooseAmountModalIncrementIcon = '.choose-amount-modal-increment-icon'
    const txDoneModalCloseButton = '.transaction-done-modal-close-btn'

    // click the increment icon each time will increment 1 usdc
    for (let i = 0; i < INVOICE_FACTORED_AMOUNT; i++) {
      cy.iframe()
        .find(chooseAmountModalIncrementIcon, { timeout: TWO_MINUTES })
        .click()
    }

    cy.iframe().find('button').contains('ACCEPT TERMS').click()
    cy.iframe().find('div').contains(`${receivedUSDC} USDC`).should('exist')
    cy.iframe().find('button').contains('APPROVE TRANSFER').click()

    // wait 2 minutes for transaction to be successful
    cy.iframe()
      .find(txDoneModalCloseButton, {
        timeout: TWO_MINUTES,
      })
      .should('be.visible')

    cy.iframe()
      .find('div')
      .contains(`${receivedUSDC} USDC is now in your wallet.`)
      .should('exist')
    cy.iframe()
      .find('div')
      .contains(
        `The remaining ${remainedUSDC} USDC will be sent to your wallet when the invoice is paid.`,
      )
      .should('exist')
  })
})
