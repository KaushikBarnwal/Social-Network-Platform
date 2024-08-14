const spinner = document.getElementById('spinner');
const errorSpin = document.getElementById('errorspin');
let users = [
    {id:1, username: 'kaushik', password: 'kaushik123'},
    {id:2, username: 'raj', password: 'raj123'}
];



let posts = [
    {id:1, userid:1, content:"Hello Myself Kaushik Raj", likes:0, comments:[]},
    {id:2, userid:2, content:"This is my Social Network Platform", likes:0, comments:[]},
    {id:3, userid:2, content:"I'm trying to post something new.", likes:0, comments:[]}
];
let profiles = {
    1: {pPic: 'images/pic1', pBio: 'Hello, i\'m Kaushik Raj.', pInfo: 'User1 Info'},
    2: {pPic: 'images/pic2', pBio: 'Hello, i\'m Raj, Nice to meet you.', pInfo: 'User2 Info'}
};
let friendRequests = {
    1: [],
    2: []
};
let friends = {
    1: [],
    2: []
}
// login - SignUp function
function login(username, password) {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || users;
    const user = storedUsers.find(u => u.username === username && u.password === password);
   console.log(storedUsers)
    //
    if (!user) {
        errorSpin.textContent = 'Invalid username or password';
        errorSpin.style.display = 'block';
        spinner.style.display = 'none';

        
    } else {
        spinner.style.display = 'none';
        localStorage.setItem('userid', user.id);
        window.location.href = 'feed.html';
    }


    // if (user) {
    //     spinner.style.display = 'none';
    //     localStorage.setItem('userid', user.id);
    //     window.location.href = 'feed.html';
    // } else {
    //     errorSpin.textContent = 'Invalid username or password';
    //     errorSpin.style.display = 'block';
    //     spinner.style.display = 'none';
    // }
}
function signup(username, password) {
    if (users.find(u => u.username === username)) {
        errorSpin.textContent = 'Username already exists';
        errorSpin.style.display = 'block';
        spinner.style.display = 'none';
        return;
    }
    const user = {id: users.length + 1, username, password};
    users.push(user);
 
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('userid', user.id)
    // updateLocalStorage('userid',user.id);
    // console.log(localStorage)
    spinner.style.display = 'none';
    // window.location.href = 'feed.html';
}
function logout() {
    localStorage.removeItem('userid');
    window.location.href = 'index.html';
}
// POST function
function createpost(content) {
    const userid = localStorage.getItem('userid') || 1;
    const post = {id: posts.length + 1, userid, content, likes:0, comments:[]};
    posts.push(post);
    renderFeed();
}
function postliked(postid) {
    const post = posts.find(p => p.id === postid);
    post.likes += 1;
    renderFeed();
}
function postcommented(postid, comment) {
    const post = posts.find(p => p.id === postid);
    post.comments.push(comment);
    renderFeed();
}
function renderFeed() {
    const feedcontainer = document.getElementById('Feedcontainer');
    feedcontainer.innerHTML = '';
    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.innerHTML = `
            <p><b>${post.content}</b></p>
            <div class="LikeDelete">
                <button onclick="postliked(${post.id})">Like ${post.likes}</button>
                <button id="deletepost">DELETE</button>
            </div>
            
            <div class="comments">
                ${post.comments.map(comment => `<p>${comment}</p><br>`).join('')}
                <input type="text" placeholder="Add a comment..." onkeypress="commentkeypressed(event, ${post.id})">
            </div>
        `;
        feedcontainer.appendChild(postDiv);
    });
}
function commentkeypressed(event, postid) {
    if (event.key === 'Enter') {
        const comment = event.target.value;
        postcommented(postid, comment);
        event.target.value = '';
    }
}
// PROFILE function
function ProfileSaved(pPic, pBio, pInfo) {
    const userid = localStorage.getItem('userid');
    profiles[userid] = {pPic, pBio, pInfo};
}
function renderProfile(){
    const userid = localStorage.getItem('userid');
    const profile = profiles[userid];
    const pContainer = document.getElementById('ProfileContainer');
    if (!pContainer) {
        console.error('ProfileContainer element not found');
        return;
    }
    pContainer.innerHTML = `
        <img src="${profile.pPic}" alt="Profile Picture" width="100">
        <p>${profile.pBio}</p>
        <p>${profile.pInfo}</p>
    `;
    // pContainer.appendChild(postDiv);
}
// Friend Request function
function sendFR(toUserid) {
    const fromUserid = localStorage.getItem('userid');
    friendRequests[toUserid].push(fromUserid);
}
function acceptFR(fromUserid) {
    const userid = localStorage.getItem('userid');
    friendRequests[userid] = friendRequests[userid].filter(id => id != fromUserid);
    friends[userid].push(fromUserid);
    friends[fromUserid].push(userid);
    renderFR();
    renderFriends();
}
function renderFR() {
    const userid = localStorage.getItem('userid');
    const requests = friendRequests[userid];
    const FRContainer = document.getElementById('FriendRequestcontainer');
    FRContainer.innerHTML = '';
    requests.forEach(requestid => {
        const requestDiv = document.createElement('div');
        requestDiv.innerHTML = `
            <p>Friend Request from User: ${requestid}</p>
            <button onclick="acceptFR(${requestid})">Accept</button>
        `;
        FRContainer.appendChild(requestDiv);
    });
}
function renderFriends() {
    const userid = localStorage.getItem('userid');
    const userfriends = friends[userid];
    const FrndContainer = document.getElementById('FriendsContainer');
    FrndContainer.innerHTML = '';
    userfriends.forEach(friendid => {
        const friendDiv = document.createElement('div');
        friendDiv.innerHTML = `
            <p>User ${friendid}</p>
        `;
        FrndContainer.appendChild(friendDiv);
    });
}


