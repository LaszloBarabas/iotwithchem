'use strict'

describe('jasmine unit test example: service', () => {

	let controller, usersFactory

	beforeEach(() => {
		module('kemia-app')

		inject(($controller, _usersFactory_) => {
			usersFactory = _usersFactory_
			controller = $controller('HomeController')

			spyOn(usersFactory, 'getUsers').and.callThrough()
		})
	})

	it('should call spy on usersFactory service', () => {
		controller.getUsers()
		expect(usersFactory.getUsers).toHaveBeenCalled()
	})
})
