import * as app from '../build/app'
import expect from "expect";
import request from "supertest";

describe('POST /users', () => {
	it('it should create a new user', (done) => {
		var text = 'Test todo text'

		request(app)
			.post('/users')
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text)
			})
			.end((err), (res) => {
				if (err) {
					return done(err)
				}
				Todo.find().then((todos) => {
					expect(todos.length).toBe(1)
					expect(todos[0].text).toBe(text)
					done()
				}).catch((e) => done(e))
			})
	})
})