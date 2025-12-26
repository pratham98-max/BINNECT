const fs = require('fs');
const https = require('https');
const path = require('path');

const folder = path.join(__dirname, 'uploads');

// List of exact filenames from the JSON data
const images = [
  "tech_hero.jpg", "fashion_hero.jpg", "fitness_hero.jpg", "nature_hero.jpg",
  "security_hero.jpg", "drone_hero.jpg", "home_hero.jpg", "art_hero.jpg",
  "finance_hero.jpg", "coffee_hero.jpg", "saas_hero.jpg", "legal_hero.jpg",
  "edu_hero.jpg", "garden_hero.jpg", "audio_hero.jpg", "crypto_hero.jpg",
  "pet_hero.jpg", "box_hero.jpg", "data_hero.jpg", "travel_hero.jpg"
];

// Unsplash random images with specific keywords to match your categories
const keywords = [
  "technology", "fashion", "fitness", "nature", "cybersecurity", 
  "drone", "architecture", "art", "finance", "coffee", 
  "software", "law", "education", "garden", "podcast", 
  "bitcoin", "dog", "shipping", "analytics", "travel"
];

const download = (url, dest, cb) => {
  const file = fs.createWriteStream(dest);
  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close(cb);
    });
  });
};

console.log("🚀 Starting download of 20 niche images...");

images.forEach((name, index) => {
  const url = `https://images.unsplash.com/photo-${index === 0 ? '1518770660439-4636190af475' : '1' + Math.floor(Math.random() * 900000)}?w=800&q=80`;
  // Alternative: Using source.unsplash style keywords for variety
  const finalUrl = `https://source.unsplash.com/800x600/?${keywords[index]}`;
  
  // Note: Since source.unsplash is deprecated, we use a reliable placeholder service:
  const reliableUrl = `https://loremflickr.com/800/600/${keywords[index]}`;

  download(reliableUrl, path.join(folder, name), () => {
    console.log(`✅ Downloaded: ${name}`);
  });
});