
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

function appendAllReceipts(show,receipt) {
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
function appendAllItems(show,item) {
    var text='';
    if(show){
        text+='<div class="read col-md-12 show">';
        text+=append(2,item.receiptID,'show');
        text+=append(2,item.receiptItemID,'show');
        text+=append(2,item.amount,'show');
        text+=append(2,item.product,'show');
        text+=append(2,item.quantity,'show');
        text+=append(2,"<button id='"+item.receiptItemID+"' class='update-item'>Izmeni</button>" +
            "<button id='"+item.receiptItemID+"' class='delete-item'>Izbrisi</button>" +
            "<button id='"+item.receiptItemID+"' class='convert-item'>Prikazi u $</button>",'show');

    }else{
        text+='<div class="write col-md-12 hide">';
        text+=appendInput(2,item.receiptID,"receiptID",false);
        text+=appendInput(2,item.receiptItemID,"receiptItemID",false);
        text+=appendInput(2,item.amount,"amount",true);
        text+=appendInput(2,item.product,"product",true);
        text+=appendInput(2,item.quantity,"quantity",true);
        text+=append(2,"<button id='"+item.receiptItemID+"' class='confirm-update-item'>Izmeni</button>" +
            "<button id='"+item.receiptItemID+"' class='cancel-update-item'>Odustani</button>",'hide');
    }
    text+='</div>';
    return text;

}
function appendNewReceipt() {
    var text='<div id="new-receipt" class="col-md-12">';
        text+=appendNewInput(2,'','show',"receiptID",false);
        text+=appendNewInput(2,'','show',"time",false);
        text+=appendNewInput(2,'','show',"person",true);
        text+=appendNewInput(2,'','show',"amount",true);
        text+=appendNewInput(2,'','show',"tableNumber",true);
        text+=append(2,"<button id='confirm-insert-receipt'>Dodaj</button><button id='cancel-insert-receipt'>Odustani</button>",'show');
        text+='</div>';
    $("#receipt-data").append(text);
}
function appendNewItem() {
    var text='<div id="new-item" class="col-md-12">';
    text+=appendNewInput(2,'','show',"receiptID",false);
    text+=appendNewInput(2,'','show',"receiptItemID",false);
    text+=appendNewInput(2,'','show',"amount",true);
    text+=appendNewInput(2,'','show',"product",true);
    text+=appendNewInput(2,'','show',"quantity",true);
    text+=append(2,"<button id='confirm-insert-item'>Dodaj</button><button id='cancel-insert-item'>Odustani</button>",'show');
    text+='</div>';
    $("#items-data").append(text);
}

$(document).ready(function () {

    $.ajax({
         url: domain + 'receipt',
         method: 'GET'
    }).done(function (data) {
         if(data.success==="false") return;
         for(var i=0;i<data.receipts.length;i++){
             var text='<div class=col-md-12 id="'+data.receipts[i].receiptID+'">';
            text+=appendAllReceipts(true,data.receipts[i]);
            text+=appendAllReceipts(false,data.receipts[i]);
            text+='</div>';
             $("#receipt-data").append(text);
         }

    });

    $('#insert-receipt').click(function () {
         if(window.localStorage.addReceiptMode ===undefined ||window.localStorage.addReceiptMode===null ||  window.localStorage.addReceiptMode=="false"){
             window.localStorage.addReceiptMode=true;
             appendNewReceipt();
         }
    });
    $('#insert-item').click(function () {
        if((window.localStorage.addItemMode ===undefined ||window.localStorage.addItemMode===null ||  window.localStorage.addItemMode=="false") &&
                window.localStorage.selectedReceipt!==null && window.localStorage.selectedReceipt!==undefined){
            window.localStorage.addItemMode=true;
            appendNewItem();
        }
    });
    $('#asc').click(function () {
        $("#receipt-data").empty();
        $("#items-data").empty();
        $.ajax({
            url: domain + 'receipt',
            method: 'GET'
        }).done(function (data) {
            if(data.success==="false") return;
            for(var i=0;i<data.receipts.length;i++){
                var text='<div class=col-md-12 id="'+data.receipts[i].receiptID+'">';
                text+=appendAllReceipts(true,data.receipts[i]);
                text+=appendAllReceipts(false,data.receipts[i]);
                text+='</div>';
                $("#receipt-data").append(text);
            }

        });
    });
    $('#desc').click(function () {
        $("#receipt-data").empty();
        $("#items-data").empty();
        $.ajax({
            url: domain + 'receipt?sort=desc',
            method: 'GET'
        }).done(function (data) {
            if(data.success==="false") return;
            for(var i=0;i<data.receipts.length;i++){
                var text='<div class=col-md-12 id="'+data.receipts[i].receiptID+'">';
                text+=appendAllReceipts(true,data.receipts[i]);
                text+=appendAllReceipts(false,data.receipts[i]);
                text+='</div>';
                $("#receipt-data").append(text);
            }

        });
    });
    $('#filter').click(function () {
        $("#receipt-data").empty();
        $("#items-data").empty();
        $.ajax({
            url: domain + 'receipt?filter='+$("#filter-input")[0].value,
            method: 'GET'
        }).done(function (data) {
            if(data.success==="false") return;
            for(var i=0;i<data.receipts.length;i++){
                var text='<div class=col-md-12 id="'+data.receipts[i].receiptID+'">';
                text+=appendAllReceipts(true,data.receipts[i]);
                text+=appendAllReceipts(false,data.receipts[i]);
                text+='</div>';
                $("#receipt-data").append(text);
            }

        });
    });


});
$(document).on('click','.select-receipt',function () {
    window.localStorage.selectedReceipt=this.id;
    $.ajax({
        url: domain + 'receipt-item?receiptID='+this.id,
        method: 'GET'
    }).done(function (data) {
        $("#items-data").empty();
        if(data.success==="false") {
            window.localStorage.selectedReceipt=null;
            return;
        }
        for(var i=0;i<data.items.length;i++){
            var text='<div class=col-md-12 id="'+data.items[i].receiptItemID+'">';
            text+=appendAllItems(true,data.items[i]);
            text+=appendAllItems(false,data.items[i]);
            text+='</div>';
            $("#items-data").append(text);
        }
    });
});
$(document).on('click','#cancel-insert-receipt',function () {
    if(window.localStorage.addReceiptMode=true){
        window.localStorage.addReceiptMode=false;
        var last=$("#receipt-data").last().children()[$("#receipt-data").last().children().length-1];
        last.remove();
    }
});
$(document).on('click','#confirm-insert-receipt',function () {
    var data={
        person:$('#new-receipt > div > input[name="person"]')[0].value,
        amount:$('#new-receipt > div > input[name="amount"]')[0].value,
        tableNumber:$('#new-receipt > div > input[name="tableNumber"]')[0].value
    };
    $.ajax({
        url: domain + 'receipt',
        method: 'POST',
        data:data
    }).done(function (data) {
        if(data.success==="false") return;
        window.localStorage.addReceiptMode=false;
        var last=$("#receipt-data").last().children()[$("#receipt-data").last().children().length-1];
        last.remove();
        var text='<div class=col-md-12 id="'+data.receipt.receiptID+'">';
        text+=appendAllReceipts(true,data.receipt);
        text+=appendAllReceipts(false,data.receipt);
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
        text+=appendAllReceipts(true,data.receipt);
        text+=appendAllReceipts(false,data.receipt);
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
$(document).on('click','#cancel-insert-item',function () {
    if(window.localStorage.addItemMode=true){
        window.localStorage.addItemMode=false;
        var last=$("#items-data").last().children()[$("#items-data").last().children().length-1];
        last.remove();
    }
});
$(document).on('click','#confirm-insert-item',function () {
    var data={
        receiptID:window.localStorage.selectedReceipt,
        amount:$('#new-item > div > input[name="amount"]')[0].value,
        product:$('#new-item > div > input[name="product"]')[0].value,
        quantity:$('#new-item > div > input[name="quantity"]')[0].value
    };
    $.ajax({
        url: domain + 'receipt-item',
        method: 'POST',
        data:data
    }).done(function (data) {
        if(data.success==="false") return;
        window.localStorage.addItemMode=false;
        var last=$("#items-data").last().children()[$("#items-data").last().children().length-1];
        last.remove();
        var text='<div class=col-md-12 id="'+data.item.receiptItemID+'">';
        text+=appendAllItems(true,data.item);
        text+=appendAllItems(false,data.item);
        text+='</div>';
        $("#items-data").append(text);

    });
});


$(document).on('click','.update-item',function () {
    if($('#items-data > #'+ this.id +' > .read').hasClass('show')){
        $('#items-data > #'+ this.id +' > .read') .removeClass('show').addClass('hide');
        $('#items-data > #'+ this.id +' > .write') .removeClass('hide').addClass('show');
        $('#items-data > #'+ this.id +' > .write > div') .removeClass('hide').addClass('show');
    }else{
        $('#items-data > #'+ this.id +' > .read') .removeClass('hide').addClass('show');
        $('#items-data > #'+ this.id +' > .write') .removeClass('show').addClass('hide');
        $('#items-data > #'+ this.id +' > .write > div') .removeClass('hide').addClass('show');
    }

});
$(document).on('click','.cancel-update-item',function () {
    if($('#items-data > #'+ this.id +' > .read').hasClass('show')){
        $('#items-data > #'+ this.id +' > .read') .removeClass('show').addClass('hide');
        $('#items-data > #'+ this.id +' > .write') .removeClass('hide').addClass('show');
        $('#items-data > #'+ this.id +' > .write > div') .removeClass('hide').addClass('show');
    }else{
        $('#items-data > #'+ this.id +' > .read') .removeClass('hide').addClass('show');
        $('#items-data > #'+ this.id +' > .write') .removeClass('show').addClass('hide');
        $('#items-data > #'+ this.id +' > .write > div') .removeClass('hide').addClass('show');
    }

});
$(document).on('click','.confirm-update-item',function () {
    var data={
        receiptID:window.localStorage.selectedReceipt,
        receiptItemID:this.id,
        amount:$('#items-data > #'+ this.id+' > .write > div > input[name="amount"]')[0].value,
        product:$('#items-data > #'+ this.id+' > .write > div > input[name="product"]')[0].value,
        quantity:$('#items-data > #'+ this.id+' > .write > div > input[name="quantity"]')[0].value
    };
    $.ajax({
        url: domain + 'receipt-item',
        method: 'PUT',
        data:data
    }).done(function (data) {
        if(data.success==="false") return;
        $('#items-data > #'+ data.item.receiptItemID).remove();
        var text='<div class=col-md-12 id="'+data.item.receiptItemID+'">';
        text+=appendAllItems(true,data.item);
        text+=appendAllItems(false,data.item);
        text+='</div>';
        $("#items-data").append(text);

    });
});
$(document).on('click','.delete-item',function () {
    var data={
        receiptID:window.localStorage.selectedReceipt,
        receiptItemID:this.id
    };
    $.ajax({
        url:domain+ 'receipt-item',
        method:'DELETE',
        data:data
    }).then(function (data) {
        if(data.success==="false") return;
        $('#items-data > #'+ data.id).remove();
    });
});
$(document).on('click','.convert-item',function () {
    var amount=$('#items-data > #'+ this.id+' > .write > div > input[name="amount"]')[0].value;
    $.ajax({
        url:'http://api.fixer.io/latest?symbols=USD,EUR',
        method:'GET'
    }).then(function (data) {
        if(data.success==="false") return;
            alert("To je "+(amount* data.rates.USD).toFixed(2) +"$");
    });
});



