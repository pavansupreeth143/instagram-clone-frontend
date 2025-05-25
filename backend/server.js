
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

let users = [];
let posts = [];

try {
    users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
} catch {}
try {
    posts = JSON.parse(fs.readFileSync('posts.json', 'utf-8'));
} catch {}

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (users.find(u => u.email === email)) return res.status(400).send('User exists');
  users.push({ email, password });
  fs.writeFileSync('users.json', JSON.stringify(users));
  res.send('Registered');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  user ? res.json({ success: true }) : res.status(401).send('Invalid login');
});

app.post('/upload', upload.single('image'), (req, res) => {
  const { email } = req.body;
  const post = { id: Date.now(), email, image: req.file.filename, likes: 0 };
  posts.push(post);
  fs.writeFileSync('posts.json', JSON.stringify(posts));
  res.send('Uploaded');
});

app.get('/posts', (req, res) => {
  res.json(posts);
});

app.post('/like', (req, res) => {
  const { id } = req.body;
  const post = posts.find(p => p.id == id);
  if (post) post.likes++;
  fs.writeFileSync('posts.json', JSON.stringify(posts));
  res.send('Liked');
});

app.listen(3000, () => console.log('Server on http://localhost:3000'));
        