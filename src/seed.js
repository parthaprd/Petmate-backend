// pet-adoption-server/src/seed.js
// Run with: node src/seed.js

const { MongoClient } = require("mongodb");
require("dotenv").config();

const OWNER_EMAIL = "demo@petadopt.com"; // change to your test email

const pets = [
  {
    name: 'Buddy',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 2,
    gender: 'Male',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600',
    healthStatus: 'Excellent',
    vaccinationStatus: 'Fully Vaccinated',
    location: 'New York, NY',
    adoptionFee: 80,
    description:
      'Buddy is an energetic and loving Golden Retriever who adores everyone he meets. He is great with kids and other dogs. He knows basic commands and loves fetch. He would thrive in an active family with a yard.',
    ownerEmail: OWNER_EMAIL,
    status: 'available',
  },
  {
    name: 'Luna',
    species: 'Cat',
    breed: 'Persian',
    age: 3,
    gender: 'Female',
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600',
    healthStatus: 'Good',
    vaccinationStatus: 'Fully Vaccinated',
    location: 'Los Angeles, CA',
    adoptionFee: 60,
    description:
      'Luna is a calm and elegant Persian cat who loves to curl up on laps. She is quiet, well-mannered, and perfect for apartment living. She gets along well with other cats but prefers a calm environment.',
    ownerEmail: OWNER_EMAIL,
    status: 'available',
  },
  {
    name: 'Max',
    species: 'Dog',
    breed: 'German Shepherd',
    age: 4,
    gender: 'Male',
    imageUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600',
    healthStatus: 'Excellent',
    vaccinationStatus: 'Fully Vaccinated',
    location: 'Chicago, IL',
    adoptionFee: 100,
    description:
      'Max is a loyal and intelligent German Shepherd. He has basic obedience training and is very protective of his family. He needs an experienced dog owner and a home with a fenced yard. He is not recommended for homes with small animals.',
    ownerEmail: OWNER_EMAIL,
    status: 'available',
  },
  {
    name: 'Coco',
    species: 'Bird',
    breed: 'African Grey Parrot',
    age: 5,
    gender: 'Female',
    imageUrl: 'https://images.unsplash.com/photo-1591198936750-16d8e15edb9e?w=600',
    healthStatus: 'Good',
    vaccinationStatus: 'Vaccinated',
    location: 'Houston, TX',
    adoptionFee: 200,
    description:
      'Coco is a highly intelligent African Grey Parrot who can mimic speech and sounds. She loves interactive toys and mental stimulation. She bonds strongly with her owner and needs daily social interaction. Ideal for an experienced bird owner.',
    ownerEmail: OWNER_EMAIL,
    status: 'available',
  },
  {
    name: 'Snowball',
    species: 'Rabbit',
    breed: 'Holland Lop',
    age: 1,
    gender: 'Male',
    imageUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600',
    healthStatus: 'Excellent',
    vaccinationStatus: 'Vaccinated',
    location: 'Phoenix, AZ',
    adoptionFee: 40,
    description:
      'Snowball is an adorable Holland Lop rabbit with the softest white fur. He is litter trained, gentle, and loves to be held. He is perfect for families or individuals who want a low-maintenance but affectionate pet.',
    ownerEmail: OWNER_EMAIL,
    status: 'available',
  },
  {
    name: 'Milo',
    species: 'Cat',
    breed: 'Maine Coon',
    age: 2,
    gender: 'Male',
    imageUrl: 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=600',
    healthStatus: 'Good',
    vaccinationStatus: 'Fully Vaccinated',
    location: 'Philadelphia, PA',
    adoptionFee: 70,
    description:
      'Milo is a large and fluffy Maine Coon who acts more like a dog than a cat. He follows his humans around, plays fetch, and loves water. He is great with children and other pets. He needs regular grooming.',
    ownerEmail: OWNER_EMAIL,
    status: 'available',
  },
  {
    name: 'Daisy',
    species: 'Dog',
    breed: 'Beagle',
    age: 3,
    gender: 'Female',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600',
    healthStatus: 'Good',
    vaccinationStatus: 'Fully Vaccinated',
    location: 'San Antonio, TX',
    adoptionFee: 75,
    description:
      'Daisy is a sweet and curious Beagle who loves exploring the outdoors. She is very friendly with people and other dogs. She has a strong nose and loves sniffing everything on walks. She would do well with an active family.',
    ownerEmail: OWNER_EMAIL,
    status: 'available',
  },
  {
    name: 'Rio',
    species: 'Bird',
    breed: 'Budgerigar',
    age: 1,
    gender: 'Male',
    imageUrl: 'https://images.unsplash.com/photo-1611689342806-0863700ba9de?w=600',
    healthStatus: 'Excellent',
    vaccinationStatus: 'Vaccinated',
    location: 'San Diego, CA',
    adoptionFee: 30,
    description:
      'Rio is a cheerful and vocal Budgerigar who loves to chirp and play. He is hand-tamed and enjoys sitting on shoulders. He is a great starter bird for first-time bird owners. He comes with a cage and accessories.',
    ownerEmail: OWNER_EMAIL,
    status: 'available',
  },
  {
    name: 'Bella',
    species: 'Dog',
    breed: 'French Bulldog',
    age: 2,
    gender: 'Female',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600',
    healthStatus: 'Good',
    vaccinationStatus: 'Fully Vaccinated',
    location: 'Dallas, TX',
    adoptionFee: 150,
    description:
      'Bella is a playful and affectionate French Bulldog who loves lounging and short play sessions. She is apartment-friendly and great with kids. She snores a little but makes up for it with endless cuddles.',
    ownerEmail: OWNER_EMAIL,
    status: 'available',
  },
  {
    name: 'Oliver',
    species: 'Cat',
    breed: 'British Shorthair',
    age: 4,
    gender: 'Male',
    imageUrl: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=600',
    healthStatus: 'Excellent',
    vaccinationStatus: 'Fully Vaccinated',
    location: 'Jacksonville, FL',
    adoptionFee: 65,
    description:
      'Oliver is a laid-back and independent British Shorthair who is content with a quiet home. He is not overly demanding but enjoys companionship. He is litter trained and very clean. Ideal for working professionals.',
    ownerEmail: OWNER_EMAIL,
    status: 'available',
  },
  {
    name: 'Hazel',
    species: 'Rabbit',
    breed: 'Lionhead',
    age: 1,
    gender: 'Female',
    imageUrl: 'https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=600',
    healthStatus: 'Good',
    vaccinationStatus: 'Vaccinated',
    location: 'Austin, TX',
    adoptionFee: 45,
    description:
      'Hazel is a tiny Lionhead rabbit with a magnificent mane. She is gentle, curious, and loves exploring safe spaces. She is litter trained and enjoys fresh vegetables. Great companion for older children and adults.',
    ownerEmail: OWNER_EMAIL,
    status: 'available',
  },
  {
    name: 'Rocky',
    species: 'Dog',
    breed: 'Labrador Retriever',
    age: 1,
    gender: 'Male',
    imageUrl: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=600',
    healthStatus: 'Excellent',
    vaccinationStatus: 'Partially Vaccinated',
    location: 'Columbus, OH',
    adoptionFee: 90,
    description:
      'Rocky is a playful Labrador puppy full of energy and love. He is still learning commands and would benefit from puppy training classes. He is great with kids and other dogs. He needs a family who can give him lots of exercise and playtime.',
    ownerEmail: OWNER_EMAIL,
    status: 'available',
  },
];

const seed = async () => {
  let client;
  try {
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('✅ MongoDB connected');

    const db = client.db();
    const petsCollection = db.collection('pets');
    const requestsCollection = db.collection('adoptionrequests');

    // Clear existing data
    await petsCollection.deleteMany({});
    await requestsCollection.deleteMany({});
    console.log('🗑️  Cleared existing pets and requests');

    // Insert pets with timestamps
    const petsWithTimestamps = pets.map(pet => ({
      ...pet,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    
    const result = await petsCollection.insertMany(petsWithTimestamps);
    console.log(`🐾 Inserted ${result.insertedIds.length} pets`);

    console.log('\n✅ Seeding complete!');
    console.log('📋 Pet IDs for testing:');
    Object.values(result.insertedIds).forEach((id, index) => {
      console.log(`   ${pets[index].name} (${pets[index].species}) → ${id}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
    }
  }
};

seed();