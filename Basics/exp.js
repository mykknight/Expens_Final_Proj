
var btn = document.getElementById('btn');
const rzp = document.getElementById('rzp-btn');
var p=false;
let w;
btn.addEventListener('click',addvalue);
rzp.addEventListener('click', rzpexp);


const token = localStorage.getItem('token');
const prm = document.getElementById('myfm');

axios.get('http://localhost:4000/expense/get-exp', { headers: {"Authorization" : token} })
.then((response) => {
    
    if(response.data.prm) {
        prm.innerHTML = 'You are a Premium User';
        prm.style.color = 'Blue';
        ShowLeadership();
     }
    console.log(response);
    for(var i=0; i<response.data.exps.length; i++){
        prtdata(response.data.exps[i]);
    }
})
.catch((err) => {
    console.log(err);
});


function addvalue(e){
    e.preventDefault();
    let Amount = document.getElementById('number').value;
    let Description = document.getElementById('text').value;
    let Category = document.getElementById('option').value;
    
    var myobj = {
        Amount: Amount,
        Description: Description,
        Category: Category
    };
    if(myobj.Amount=='' || myobj.Description=='') alert("Please enter the details");
    else{
        
        axios.post('http://localhost:4000/expense/add-exp',myobj, {headers: {"Authorization": token } })
        .then((response) => {
           prtdata(response.data.newEx);
        })
        .catch((err) => {
            console.log(err);
        });
    }
}

function prtdata(myobj){

    var ui = document.getElementById('details');

    var li = document.createElement('li');

    li.appendChild(document.createTextNode(myobj.Amount+" - "+myobj.Description+" - "+myobj.Category+" "));

    var dlt = document.createElement('input');
    dlt.type = 'button';
    dlt.value = 'Dlt Exp';
    dlt.style.backgroundColor = 'red';
    li.appendChild(dlt);

    dlt.addEventListener('click',dltexp);


    function dltexp(e){
        console.log(myobj.id);
        axios.delete(`http://localhost:4000/expense/dlt-exp/${myobj.id}`, {headers: {"Authorization": token}});
        li.remove();
    }

    ui.append(li);
}

async function rzpexp(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    console.log(13);
    const response = await axios.get('http://localhost:4000/purchase/premiummembership', { headers: {"Authorization": token}});
    console.log(response);
    var options = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            await axios.post('http://localhost:4000/purchase/updatetransactionstatus', {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, {headers: {"Authorization": token} }  )

            alert("You are a Premium User Now")
            prm.innerHTML = 'You are a Premium User';
            prm.style.color = 'Blue';
            ShowLeadership();
            
        },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();

    rzp1.on('payment.failed', async function (response) {
        await axios.post('http://localhost:4000/purchase/updatetransactionstatus', {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
        }, {headers: {"Authorization": token} }  )
        console.log(response);
        alert('Something went wrong');
    });

}

async function ShowLeadership() {
    let newElement = document.createElement('button');
    newElement.innerHTML = 'Leader Board';

    newElement.onclick = async () => {
        const ldrbrdarray = await axios.get('http://localhost:4000/premium/leaderboard',  { headers: {"Authorization" : token} });
        console.log(ldrbrdarray);
        console.log(8);

        const ui = document.getElementById('ldbr');
        ui.innerHTML = 'Leader Board';
        ldrbrdarray.data.forEach(element => {
            let li = document.createElement('li');
            li.appendChild(document.createTextNode(`Name: ${element.UserName} ; TotalExpense: ${element.TotalCost}`));
            ui.append(li);
        });
    
    }
    document.getElementById('con').insertBefore(newElement, document.getElementById('p4'));

}

function download() {
    axios.get('http://localhost:4000/userfile/download', {headers: {"Authorization" : token}})
    .then(res => {
        console.log(res);
        if(res.status == 200){
            var a =document.createElement('a');
            a.href = res.data.fileURL;
            a.download = 'myexpense.csv';
            a.click();
        }
        else {
            throw new Error(res.data.err);
        }
    })
    .catch(err => console.log(err.response.data.err));
}