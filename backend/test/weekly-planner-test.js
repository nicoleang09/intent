process.env.NODE_ENV = 'test';

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';

chai.use(chaiHttp);
let should = chai.should();

describe("Simple test", () => {
  it("should return true", (done) => {
    chai.request(app)
      .get("/")
      .end((err, res) => {
        res.body.should.equal("Hello world!");
        done();
      });
  });
});