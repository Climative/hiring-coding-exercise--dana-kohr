import { Knex } from 'knex';

/**
 * Sample seed data for development and testing
 */
export async function seed(knex: Knex): Promise<void> {
  // Clear existing data
  await knex('locations').del();
  await knex('addresses').del();

  // Insert sample addresses
  const addresses = await knex('addresses')
    .insert([
      {
        street: '1600 Pennsylvania Avenue NW',
        city: 'Washington',
        state: 'DC',
        zip_code: '20500',
        country: 'USA',
      },
      {
        street: '350 Fifth Avenue',
        city: 'New York',
        state: 'NY',
        zip_code: '10118',
        country: 'USA',
      },
      {
        street: '1 Infinite Loop',
        city: 'Cupertino',
        state: 'CA',
        zip_code: '95014',
        country: 'USA',
      },
      {
        street: '1600 Amphitheatre Parkway',
        city: 'Mountain View',
        state: 'CA',
        zip_code: '94043',
        country: 'USA',
      },
      {
        street: '1901 Convention Center Drive',
        city: 'Miami Beach',
        state: 'FL',
        zip_code: '33139',
        country: 'USA',
      },
      {
        street: '233 S Wacker Drive',
        city: 'Chicago',
        state: 'IL',
        zip_code: '60606',
        country: 'USA',
      },
      {
        street: '1000 5th Avenue',
        city: 'Seattle',
        state: 'WA',
        zip_code: '98104',
        country: 'USA',
      },
      {
        street: '301 Congress Avenue',
        city: 'Austin',
        state: 'TX',
        zip_code: '78701',
        country: 'USA',
      },
      {
        street: '1 Faneuil Hall Marketplace',
        city: 'Boston',
        state: 'MA',
        zip_code: '02109',
        country: 'USA',
      },
      {
        street: '1670 Broadway',
        city: 'Denver',
        state: 'CO',
        zip_code: '80202',
        country: 'USA',
      },
      {
        street: '11 Wall Street',
        city: 'New York',
        state: 'NY',
        zip_code: '10005',
        country: 'USA',
      },
      {
        street: '100 S Figueroa Street',
        city: 'Los Angeles',
        state: 'CA',
        zip_code: '90012',
        country: 'USA',
      },
    ])
    .returning('id');

  // Insert sample locations
  await knex('locations').insert([
    {
      address_id: addresses[0].id,
      name: 'The White House',
      latitude: 38.8977,
      longitude: -77.0365,
      description: 'Official residence of the President of the United States',
      is_active: true,
    },
    {
      address_id: addresses[1].id,
      name: 'Empire State Building',
      latitude: 40.7484,
      longitude: -73.9857,
      description: 'Iconic 102-story Art Deco skyscraper',
      is_active: true,
    },
    {
      address_id: addresses[2].id,
      name: 'Apple Park (Historic)',
      latitude: 37.3318,
      longitude: -122.0312,
      description: 'Former Apple headquarters',
      is_active: false,
    },
    {
      address_id: addresses[3].id,
      name: 'Googleplex',
      latitude: 37.4220,
      longitude: -122.0841,
      description: 'Google headquarters complex',
      is_active: true,
    },
    {
      address_id: addresses[4].id,
      name: 'Miami Beach Convention Center',
      latitude: 25.7907,
      longitude: -80.1300,
      description: 'Major convention and exhibition center in South Florida',
      is_active: true,
    },
    {
      address_id: addresses[5].id,
      name: 'Willis Tower',
      latitude: 41.8789,
      longitude: -87.6359,
      description: '110-story skyscraper, formerly known as Sears Tower',
      is_active: true,
    },
    {
      address_id: addresses[6].id,
      name: 'Seattle Public Library - Central Branch',
      latitude: 47.6062,
      longitude: -122.3321,
      description: 'Iconic modern library designed by Rem Koolhaas',
      is_active: true,
    },
    {
      address_id: addresses[7].id,
      name: 'Texas State Capitol',
      latitude: 30.2747,
      longitude: -97.7404,
      description: 'Historic state capitol building in downtown Austin',
      is_active: true,
    },
    {
      address_id: addresses[8].id,
      name: 'Faneuil Hall',
      latitude: 42.3601,
      longitude: -71.0543,
      description: 'Historic marketplace and meeting hall since 1743',
      is_active: true,
    },
    {
      address_id: addresses[9].id,
      name: 'Denver Center for the Performing Arts',
      latitude: 39.7447,
      longitude: -104.9991,
      description: 'Largest performing arts center in the Rocky Mountain region',
      is_active: true,
    },
    {
      address_id: addresses[10].id,
      name: 'New York Stock Exchange',
      latitude: 40.7074,
      longitude: -74.0113,
      description: "World's largest stock exchange by market capitalization",
      is_active: true,
    },
    {
      address_id: addresses[11].id,
      name: 'LA City Hall',
      latitude: 34.0537,
      longitude: -118.2427,
      description: 'Historic city hall building completed in 1928',
      is_active: true,
    },
  ]);
}
