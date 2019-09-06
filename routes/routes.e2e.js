require('../test/test-setup')();
require('dotenv').config();
const request = require('supertest');
const app = require('../app');

describe('/getIpsByBoundaryBox GET', () => {
    it('should return an array of network geolocations', (done) => {
        request(app).get('/getIpsByBoundaryBox?latArr[]=36.10092635302054&latArr[]=36.08011874560354&longArr[]=-78.87897578180763&longArr[]=-78.94124594629737')
            .expect(200)
            .end((err, res) => {
                expect(res.body.length).not.toBeUndefined();
                expect(res.body.length).toBeGreaterThanOrEqual(1);
                expect(res.body[0].length).not.toBeUndefined();
                expect(res.body[0].length).toEqual(3);
                done();
            });
    });
});
