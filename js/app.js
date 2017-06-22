
window.localStorage.clear();
var domain="http://localhost/iteh-server/router.php/";
function append(size,data,show) {
    return '<div class="'+show+' col-md-'+size+'">'+data+'</div>';
}
function appendInput(size,data,field,enabled) {
    if(enabled){
        return '<div class="hide col-md-'+size+'"><input name="'+field+'" value="'+data+'"></div>';
    }
    return '<div class="hide col-md-'+size+'"><input name="'+field+'" value="#" disabled></div>';
}
function appendNewInput(size,data,show,field,enabled) {
    if(enabled){
        return '<div class="'+show+' col-md-'+size+'"><input name="'+field+'" value="'+data+'"></div>';
    }else{
        return '<div class="'+show+' col-md-'+size+'"><input name="'+field+'" value="#" disabled></div>';
    }
}

function appendAll(show,receipt) {
    var text='';
    if(show){
        text+='<div class="read col-md-12 show">';
        text+=append(2,receipt.receiptID,'show');
        text+=append(2,receipt.time,'show');
        text+=append(2,receipt.person,'show');
        text+=append(2,receipt.amount,'show');
        text+=append(2,receipt.tableNumber,'show');
        text+=append(2,"<button id='"+receipt.receiptID+"' class='select-receipt'>Vidi stavke</button>" +
            "<button id='"+receipt.receiptID+"' class='update-receipt'>Izmeni</button>" +
            "<button id='"+receipt.receiptID+"' class='delete-receipt'>Izbrisi</button>",'show');

    }else{
        text+='<div class="write col-md-12 hide">';
        text+=appendInput(2,receipt.receiptID,"receiptID",false);
        text+=appendInput(2,receipt.time,"time",false);
        text+=appendInput(2,receipt.person,"person",true);
        text+=appendInput(2,receipt.amount,"amount",true);
        text+=appendInput(2,receipt.tableNumber,"tableNumber",true);
        text+=append(2,"<button id='"+receipt.receiptID+"' class='confirm-update-receipt'>Izmeni</button>" +
                        "<button id='"+receipt.receiptID+"' class='cancel-update-receipt'>Odustani</button>",'hide');
    }
    text+='</div>';
   return text;

}
function appendNew() {
    var text='<div id="new" class="col-md-12">';
        text+=appendNewInput(2,'','show',"receiptID",false);
        text+=appendNewInput(2,'','show',"time",false);
        text+=appendNewInput(2,'','show',"person",true);
        text+=appendNewInput(2,'','show',"amount",true);
        text+=appendNewInput(2,'','show',"tableNumber",true);
        text+=append(2,"<button id='confirm-insert-receipt'>Dodaj</button><button id='cancel-insert-receipt'>Odustani</button>",'show');
        text+='</div>';
    $("#receipt-data").append(text);


}
$(document).ready(function () {

     $.ajax({
         url: domain + 'receipt',
         method: 'GET'
     }).done(function (data) {
         if(data.success==="false") return;
         for(var i=0;i<data.receipts.length;i++){
             var text='<div class=col-md-12 id="'+data.receipts[i].receiptID+'">';
            text+=appendAll(true,data.receipts[i]);
            text+=appendAll(false,data.receipts[i]);
            text+='</div>';
             $("#receipt-data").append(text);
         }

     });

     $('#insert-receipt').click(function () {
         if(window.localStorage.addMode ===undefined ||window.localStorage.addMode===null ||  window.localStorage.addMode=="false"){
             window.localStorage.addMode=true;
             appendNew();
         }

     });



});
$(document).on('click','#cancel-insert-receipt',function () {
    if(window.localStorage.addMode=true){
        window.localStorage.addMode=false;
        var last=$("#receipt-data").last().children()[$("#receipt-data").last().children().length-1];
        last.remove();
    }
});
$(document).on('click','#confirm-insert-receipt',function () {
    var data={
        person:$('#new > div > input[name="person"]')[0].value,
        amount:$('#new > div > input[name="amount"]')[0].value,
        tableNumber:$('#new > div > input[name="tableNumber"]')[0].value
    };
    $.ajax({
        url: domain + 'receipt',
        method: 'POST',
        data:data
    }).done(function (data) {
        if(data.success==="false") return;
        window.localStorage.addMode=false;
        var last=$("#receipt-data").last().children()[$("#receipt-data").last().children().length-1];
        last.remove();
        var text='<div class=col-md-12 id="'+data.receipt.receiptID+'">';
        text+=appendAll(true,data.receipt);
        text+=appendAll(false,data.receipt);
        text+='</div>';
        $("#receipt-data").append(text);

    });
});


$(document).on('click','.update-receipt',function () {
    if($('#receipt-data > #'+ this.id +' > .read').hasClass('show')){
        $('#receipt-data > #'+ this.id +' > .read') .removeClass('show').addClass('hide');
        $('#receipt-data > #'+ this.id +' > .write') .removeClass('hide').addClass('show');
        $('#receipt-data > #'+ this.id +' > .write > div') .removeClass('hide').addClass('show');
    }else{
        $('#receipt-data > #'+ this.id +' > .read') .removeClass('hide').addClass('show');
        $('#receipt-data > #'+ this.id +' > .write') .removeClass('show').addClass('hide');
        $('#receipt-data > #'+ this.id +' > .write > div') .removeClass('hide').addClass('show');
    }

});
$(document).on('click','.cancel-update-receipt',function () {
    if($('#receipt-data > #'+ this.id +' > .read').hasClass('show')){
        $('#receipt-data > #'+ this.id +' > .read') .removeClass('show').addClass('hide');
        $('#receipt-data > #'+ this.id +' > .write') .removeClass('hide').addClass('show');
        $('#receipt-data > #'+ this.id +' > .write > div') .removeClass('hide').addClass('show');
    }else{
        $('#receipt-data > #'+ this.id +' > .read') .removeClass('hide').addClass('show');
        $('#receipt-data > #'+ this.id +' > .write') .removeClass('show').addClass('hide');
        $('#receipt-data > #'+ this.id +' > .write > div') .removeClass('hide').addClass('show');
    }

});
$(document).on('click','.confirm-update-receipt',function () {
    var data={
        receiptID:this.id,
        person:$('#receipt-data > #'+ this.id+' > .write > div > input[name="person"]')[0].value,
        amount:$('#receipt-data > #'+ this.id+' > .write > div > input[name="amount"]')[0].value,
        tableNumber:$('#receipt-data > #'+ this.id+' > .write > div > input[name="tableNumber"]')[0].value
    };
    $.ajax({
        url: domain + 'receipt',
        method: 'PUT',
        data:data
    }).done(function (data) {
        if(data.success==="false") return;
        $('#receipt-data > #'+ data.receipt.receiptID).remove();
        var text='<div class=col-md-12 id="'+data.receipt.receiptID+'">';
        text+=appendAll(true,data.receipt);
        text+=appendAll(false,data.receipt);
        text+='</div>';
        $("#receipt-data").append(text);

    });
});
$(document).on('click','.delete-receipt',function () {
    var data={
      receiptID:this.id
    };
    $.ajax({
        url:domain+ 'receipt',
        method:'DELETE',
        data:data
    }).then(function (data) {
        if(data.success==="false") return;
            $('#receipt-data > #'+ data.id).remove();
    });
});



