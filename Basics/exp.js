var btn = document.getElementById('btn');
var p=false;
let w;
btn.addEventListener('click',addvalue);


axios.get('http://localhost:4000/expense/get-exp')
.then((response) => {
    for(var i=0; i<response.data.length; i++){
        prtdata(response.data[i]);
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
        
        axios.post('http://localhost:4000/expense/add-exp', myobj)
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
        axios.delete(`http://localhost:4000/expense/dlt-exp/${myobj.id}`);
        li.remove();
    }

    ui.append(li);
}
