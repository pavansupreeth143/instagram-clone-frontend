
const backendURL = "https://your-backend-url"; // Replace with Railway URL

async function fetchPosts() {
  const res = await fetch(backendURL + '/posts');
  const posts = await res.json();
  const postsDiv = document.getElementById('posts');
  postsDiv.innerHTML = '';
  posts.forEach(post => {
    const el = document.createElement('div');
    el.innerHTML = \`
      <img src="\${backendURL}/uploads/\${post.image}" width="200"><br>
      Posted by: \${post.email} | Likes: \${post.likes}
      <button onclick="likePost(\${post.id})">❤️ Like</button><br><br>
    \`;
    postsDiv.appendChild(el);
  });
}

async function likePost(id) {
  await fetch(backendURL + '/like', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  fetchPosts();
}

document.getElementById('uploadForm').onsubmit = async (e) => {
  e.preventDefault();
  const form = new FormData();
  form.append('email', document.getElementById('email').value);
  form.append('image', document.getElementById('image').files[0]);
  await fetch(backendURL + '/upload', { method: 'POST', body: form });
  fetchPosts();
};

fetchPosts();
        