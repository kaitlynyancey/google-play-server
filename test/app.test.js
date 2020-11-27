const supertest = require('supertest');
const app = require('../app');
const { expect } = require('chai');

describe('GET /apps', () => {
    it('should return an array of apps', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                const app = res.body[0];
                expect(app).to.include.all.keys(
                    'App', 'Rating', 'Genres', 'Last Updated'
                );
            })
    })
    it('should be 400 if sort value is invalid', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'NOPE' })
            .expect(400, 'Sort must be one of Rating or App')
    })
    it('should be 400 if genre value is invalid', () => {
        return supertest(app)
            .get('/apps')
            .query({ genres: 'NOT A GENRE'} )
            .expect(400, 'Genre must be either Action, Puzzle, Strategy, Casual, Arcade, or Card')

    })
    it('should sort by app title', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'App' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;
                let i = 0;
                while (i < res.body.length - 1){
                    const appAtI = res.body[i];
                    const appAtIPlus = res.body[i + 1];
                    if(appAtIPlus.App < appAtI.App){
                        sorted = false;
                        break;
                    }
                    i++;
                }
                expect(sorted).to.be.true;
            })
    })
    it('should sort by rating', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'Rating' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;
                let i = 0;
                while (i < res.body.length - 1){
                    const appAtI = res.body[i];
                    const appAtIPlus = res.body[i + 1];
                    if(appAtIPlus.Rating < appAtI.Rating){
                        sorted = false;
                        break;
                    }
                    i++;
                }
                expect(sorted).to.be.true;
            })
    })
    it('should sort by genre', () => {
        return supertest(app)
            .get('/apps')
            .query({ genres: 'action' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let i = 0;
                while (i < res.body.length){
                    const app = res.body[i];
                    expect(app.Genres).to.include('Action')
                    i++;
                }
            })
    })
})