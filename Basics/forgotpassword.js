const frgt = document.getElementById('frgtpsd');
frgt.addEventListener('click', forgotPassword);




async function forgotPassword(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;

    const myObj = {
        email: email
    }

    await axios.post('http://44.201.35.159:4000/password/forgotpassword', myObj)
    .then(res => {
        console.log(res);
        alert(`${res.data.message}`);
        window.location.href = `http://44.201.35.159:4000/password/resetpassword/${res.data.id}`;

    })
    .catch(err => console.log(err));
}