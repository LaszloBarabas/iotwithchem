
'use strict'

describe('Protractor end to end tests for iotWithChem', () => {
	it('should have a title', () => {

    // global object from Protractor
		browser.get('localhost:8081')

		expect(browser.getTitle()).toEqual('Kemia App')
	})
})
