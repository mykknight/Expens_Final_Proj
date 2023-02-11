var btn = document.getElementById('signup');
if(btn) btn.addEventListener('click', signup);

var lgn = document.getElementById('login');
if(lgn) lgn.addEventListener('click', login);

function signup(e) {
    e.preventDefault();
    let f=0;

    let p = document.getElementById('p');
    p.innerText = "";

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let psd = document.getElementById('psw').value;

    let myObj = {
        Name: name,
        Email: email,
        Password: psd
    };

    if(name == '' || email == '' || psd == '') return alert('Please fill the data');

    axios.get('http://localhost:4000/user/signup')
    .then(res => {
        for(let i=0; i<res.data.length; i++){
            if(res.data.Email == email) f=1;
        }

        if(f==0) {
            axios.post('http://localhost:4000/user/signup', myObj)
            .then((res) => console.log(res.data.add))
            .catch((err) => {
                //let p =document.getElementById('p');
                p.appendChild(document.createTextNode('User already exists'));
                alert('User already exist');
                f=0;
                console.log(err)});
        }
    })
    .then(err => console.log(err));
}

function login(e) {
    e.preventDefault();
    let q = document.getElementById('q');
    q.innerText = "";

    let email = document.getElementById('email').value;
    let psd = document.getElementById('psw').value;

    let myObj = {
        Email: email,
        Password: psd
    };

    if(email == '' || psd == '') return alert('Please fill the data');

    axios.post('http://localhost:4000/user/login', myObj)
    .then(msg => {
        console.log(msg);
        alert('User Sucessfully login');
    })
    .catch(err => {
        if(err.response.status == 404) q.appendChild(document.createTextNode('User doesn`t exist'));
        else q.appendChild(document.createTextNode('Password is wrong'));
    }); 

}