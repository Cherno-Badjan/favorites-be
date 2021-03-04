require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;

    beforeAll(async done => {
      execSync('npm run setup-db');

      client.connect();

      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'chernob@gmail.com',
          password: 'bingo123'
        });

      token = signInData.body.token; // eslint-disable-line

      return done();
    });

    afterAll(done => {
      return client.end(done);
    });

    test('creates a favorite', async () => {

      const newFav = {

        "yelp_id": "s42wLKqrflqmtqkgqOX78",
        "name": "Luc Lac 24",
        "image_url": "https://s3-media1.fl.yelpcdn.com/bphoto/azr6sD6VeJbdaiO2aKvSsw/o.jpg",
        "rating": "4.5",
        "user_id": 2
      };

      const dbFav = [{
        ...newFav,
        id: 4,
      }];

      const data = await fakeRequest(app)
        .post('/api/favorites')
        .send(newFav)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(dbFav);

    });

    test('returns all favorites', async () => {

      const expected = [

        {
          "id": 4,
          "yelp_id": "s42wLKqrflqmtqkgqOX78",
          "name": "Luc Lac 24",
          "image_url": "https://s3-media1.fl.yelpcdn.com/bphoto/azr6sD6VeJbdaiO2aKvSsw/o.jpg",
          "rating": "4.5",
          "user_id": 2
        }

      ];

      const data = await fakeRequest(app)
        .get('/api/favorites')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expected);
    });

    test('deletes a favorite with matching id ', async () => {

      const expectation = [
        {
          "id": 4,
          "yelp_id": "s42wLKqrflqmtqkgqOX78",
          "name": "Luc Lac 24",
          "image_url": "https://s3-media1.fl.yelpcdn.com/bphoto/azr6sD6VeJbdaiO2aKvSsw/o.jpg",
          "rating": "4.5",
          "user_id": 2
        }
      ];



      const data = await fakeRequest(app)
        .delete('/api/favorites/4')
        .set('Authorization', token)
        .expect('Content-Type', /json/);
      //   .expect(200);

      expect(data.body).toEqual(expectation);

      const nothing = await fakeRequest(app)
        .get('/api/favorites')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);


      expect(nothing.body).toEqual([]);
    });


    test.skip('returns animals', async () => {

      const expectation = [
        {
          'yelp_id': 'OQ2oHkcWA8KNC1Lsvj1SBA',
          'name': 'Screen Door',
          'image_url': 'https://s3-media4.fl.yelpcdn.com/bphoto/lqmMYlLRV-aoH73koWA6Ew/o.jpg',
          'rating': '4.5',
          'url': 'https://www.yelp.com/biz/screen-door-portland?adjust_creative=W4-fw5orI81WMg21PQOASQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=W4-fw5orI81WMg21PQOASQ'
        },
        {
          'yelp_id': 'o_L9Ss4boqq6ZEF9xeSH6Q',
          'name': 'Salt & Straw',
          'image_url': 'https://s3-media1.fl.yelpcdn.com/bphoto/r6y-0Q2z3cnx1bQKxn-iHw/o.jpg',
          'rating': '4.5',
          'url': 'https://www.yelp.com/biz/salt-and-straw-portland-2?adjust_creative=W4-fw5orI81WMg21PQOASQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=W4-fw5orI81WMg21PQOASQ'
        },
        {
          'yelp_id': 'MVm6pgnnd6Sg_LdtUhkGuw',
          'name': 'Pip/"s Original Doughnuts & Chai',
          'image_url': 'https://s3-media3.fl.yelpcdn.com/bphoto/IOLkS4N0L-fFdjuNVkBPrQ/o.jpg',
          'rating': '4.5',
          'url': 'https://www.yelp.com/biz/pips-original-doughnuts-and-chai-portland?adjust_creative=W4-fw5orI81WMg21PQOASQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=W4-fw5orI81WMg21PQOASQ'
        },
        {
          'yelp_id': '5oed6H5F8qZxNzELq_1e1w',
          'name': 'Pine State Biscuits',
          'image_url': 'https://s3-media3.fl.yelpcdn.com/bphoto/XUBi0it3i2OZKq0187-RSg/o.jpg',
          'rating': '4.5',
          'url': 'https://www.yelp.com/biz/pine-state-biscuits-portland-2?adjust_creative=W4-fw5orI81WMg21PQOASQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=W4-fw5orI81WMg21PQOASQ'
        },
        {
          'yelp_id': 'LF0EuyDA4-rhb6s36q0wsQ',
          'name': 'Andina Restaurant',
          'image_url': 'https://s3-media1.fl.yelpcdn.com/bphoto/Ij9yv97Ch6NwKhNdpezRhw/o.jpg',
          'rating': '4.5',
          'url': 'https://www.yelp.com/biz/andina-restaurant-portland?adjust_creative=W4-fw5orI81WMg21PQOASQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=W4-fw5orI81WMg21PQOASQ'
        },
        {
          'yelp_id': '4CxF8c3MB7VAdY8zFb2cZQ',
          'name': 'Voodoo Doughnut - Old Town',
          'image_url': 'https://s3-media4.fl.yelpcdn.com/bphoto/qHrzQy5ih2Sjhn7MdsCASw/o.jpg',
          'rating': '3.5',
          'url': 'https://www.yelp.com/biz/voodoo-doughnut-old-town-portland-2?adjust_creative=W4-fw5orI81WMg21PQOASQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=W4-fw5orI81WMg21PQOASQ'
        },
        {
          'yelp_id': 'IyLLref8p5xTcuO7SpHf-g',
          'name': 'Salt & Straw',
          'image_url': 'https://s3-media1.fl.yelpcdn.com/bphoto/Frsr2t1EaQS2pSRDPf9uyg/o.jpg',
          'rating': '4.5',
          'url': 'https://www.yelp.com/biz/salt-and-straw-portland?adjust_creative=W4-fw5orI81WMg21PQOASQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=W4-fw5orI81WMg21PQOASQ'
        },
        {
          'yelp_id': 'qeuJgUdcmL5yAweOsMm6rA',
          'name': 'Deschutes Brewery Portland Public House',
          'image_url': 'https://s3-media1.fl.yelpcdn.com/bphoto/a-Av4dG6Xv3f1_XysFj4ow/o.jpg',
          'rating': '4',
          'url': 'https://www.yelp.com/biz/deschutes-brewery-portland-public-house-portland?adjust_creative=W4-fw5orI81WMg21PQOASQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=W4-fw5orI81WMg21PQOASQ'
        },
        {
          'yelp_id': '4Hc4QRv8PBlTXi9jm2s5cw',
          'name': 'Salt & Straw',
          'image_url': 'https://s3-media4.fl.yelpcdn.com/bphoto/tlm_JobdYI6EQoaMGumUYA/o.jpg',
          'rating': '4.5',
          'url': 'https://www.yelp.com/biz/salt-and-straw-portland-4?adjust_creative=W4-fw5orI81WMg21PQOASQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=W4-fw5orI81WMg21PQOASQ'
        },
        {
          'yelp_id': 'Ys42wLKqrflqmtqkgqOXgA',
          'name': 'Luc Lac',
          'image_url': 'https://s3-media1.fl.yelpcdn.com/bphoto/azr6sD6VeJbdaiO2aKvSsw/o.jpg',
          'rating': '4',
          'url': 'https://www.yelp.com/biz/luc-lac-portland-7?adjust_creative=W4-fw5orI81WMg21PQOASQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=W4-fw5orI81WMg21PQOASQ'
        },
        {
          'yelp_id': '32hFMl7d-243oMULkn84VQ',
          'name': 'The Waffle Window',
          'image_url': 'https://s3-media2.fl.yelpcdn.com/bphoto/2RmqHERx60kl12XscM0akg/o.jpg',
          'rating': '4.5',
          'url': 'https://www.yelp.com/biz/the-waffle-window-portland?adjust_creative=W4-fw5orI81WMg21PQOASQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=W4-fw5orI81WMg21PQOASQ'
        },
        {
          'yelp_id': 'eUbq0uNxRlXQ6sy7phM7yA',
          'name': 'Lechon',
          'image_url': 'https://s3-media4.fl.yelpcdn.com/bphoto/wxLJSjqdB0v3wZSRqyNweg/o.jpg',
          'rating': '4.5',
          'url': 'https://www.yelp.com/biz/lechon-portland?adjust_creative=W4-fw5orI81WMg21PQOASQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=W4-fw5orI81WMg21PQOASQ'
        },
        {
          'yelp_id': 'fP45Ns78xlfeAs2ouHklOg',
          'name': 'Cheryl’s on 12th',
          'image_url': 'https://s3-media1.fl.yelpcdn.com/bphoto/e4qKpwprT3RIAonsescOAQ/o.jpg',
          'rating': '4.5',
          'url': 'https://www.yelp.com/biz/cheryl-s-on-12th-portland?adjust_creative=W4-fw5orI81WMg21PQOASQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=W4-fw5orI81WMg21PQOASQ'
        },
        {
          'yelp_id': '6VhcvzGrfYYSygc9UKYfQw',
          'name': 'Nong"/s Khao Man Gai',
          'image_url': 'https://s3-media3.fl.yelpcdn.com/bphoto/jtp9n8HTjid4lEeXlcKKiA/o.jpg',
          'rating': '4.5',
          'url': 'https://www.yelp.com/biz/nongs-khao-man-gai-portland-2?adjust_creative=W4-fw5orI81WMg21PQOASQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=W4-fw5orI81WMg21PQOASQ'
        },
        {
          'yelp_id': 'GgDKxGZBmzdyWmExESK14g',
          'name': 'The Observatory',
          'image_url': 'https://s3-media4.fl.yelpcdn.com/bphoto/Nq3mj7psTuj5GKHL15qEcw/o.jpg',
          'rating': '4.5',
          'url': 'https://www.yelp.com/biz/the-observatory-portland?adjust_creative=W4-fw5orI81WMg21PQOASQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=W4-fw5orI81WMg21PQOASQ'
        },
        {
          'yelp_id': '--UNNdnHRhsyFUbDgumdtQ',
          'name': 'Le Pigeon',
          'image_url': 'https://s3-media2.fl.yelpcdn.com/bphoto/ARlFgwCNq62izXYf1TUQiA/o.jpg',
          'rating': '4.5',
          'url': 'https://www.yelp.com/biz/le-pigeon-portland-2?adjust_creative=W4-fw5orI81WMg21PQOASQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=W4-fw5orI81WMg21PQOASQ'
        },
        {
          'yelp_id': '0jlUpkdXg3LCE44UKKhjqA',
          'name': 'Portland City Grill',
          'image_url': 'https://s3-media1.fl.yelpcdn.com/bphoto/-N8P6cTACCKnSuJaqeCyXg/o.jpg',
          'rating': '4',
          'url': 'https://www.yelp.com/biz/portland-city-grill-portland-7?adjust_creative=W4-fw5orI81WMg21PQOASQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=W4-fw5orI81WMg21PQOASQ'
        },
        {
          'yelp_id': 'YaUGYnfBjq1V-sI0BSokSQ',
          'name': 'Ovation Coffee & Tea',
          'image_url': 'https://s3-media2.fl.yelpcdn.com/bphoto/TmgO-Db06XaWze9irs92IA/o.jpg',
          'rating': '5',
          'url': 'https://www.yelp.com/biz/ovation-coffee-and-tea-portland?adjust_creative=W4-fw5orI81WMg21PQOASQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=W4-fw5orI81WMg21PQOASQ'
        },
        {
          'yelp_id': 'gXPeMjI_D92gG53mZZKmAA',
          'name': 'Pambiche',
          'image_url': 'https://s3-media1.fl.yelpcdn.com/bphoto/Xr6RzoQvxFHP5oiQ9F2VSw/o.jpg',
          'rating': '4',
          'url': 'https://www.yelp.com/biz/pambiche-portland?adjust_creative=W4-fw5orI81WMg21PQOASQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=W4-fw5orI81WMg21PQOASQ'
        },
        {
          'yelp_id': '9bPpqyFm5zjM0qC5uo8fVg',
          'name': 'International Rose Test Garden',
          'image_url': 'https://s3-media3.fl.yelpcdn.com/bphoto/_dp4N1mmlh0_Muvl9j7CEQ/o.jpg',
          'rating': '4.5',
          'url': 'https://www.yelp.com/biz/international-rose-test-garden-portland?adjust_creative=W4-fw5orI81WMg21PQOASQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=W4-fw5orI81WMg21PQOASQ'
        }
      ];

      const data = await fakeRequest(app)
        .get('/api/search')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
