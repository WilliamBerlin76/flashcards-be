const admin = require('../config/firestore-config');
const server = require('../api/server')
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;

const chaiHttp = require('chai-http');

chai.use(chaiHttp);

chai.should();

const cards = [{front: 'front', back: 'back'}, {front: 'front', back: 'back'}]
const deck = {icon: 'yere', tags: [1,2,3]}
// describe('endpoints', () => {

//     describe('post /api/deck/:id/:colId', () => {
//         it('posts a deck to the user', (done) => {
            
//             chai.request(server)
//                 .post("/1234/123")
//                 .send(cards, deck)
//                 .end((err, response) => {
//                     console.log(response)
//                     response.should.have.status(201)
//                 });
//                 done();
//         })
//     })
// })