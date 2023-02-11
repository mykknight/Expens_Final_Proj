var btn = document.getElementById('submit');
btn.addEventListener('click', signup);

function signup(e) {
    e.preventDefault();

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let psd = document.getElementById('psw').value;

    var myObj = {
        Name: name,
        Email: email,
        Password: psd
    };

    if(name == '' || email == '' || psd == '') return alert('Please fill the data');

    axios.post('http://localhost:4000/user/signup', myObj)
    .then((res) => console.log(res.data.add))
    .catch((err) => {
        console.log(err.message);
        let ui = document.getElementById('div');
        ui.appendChild(document.createElement('p').appendChild(document.createTextNode('User already Exists')));
    })
}