/**
 * Created by Vongkol on 4/1/2017.
 */
$(document).ready(function () {
    getDistrict();
    // filter district on province change
    $("#province").change(function () {
      getDistrict();
    });
    $("#district").change(function () {
        getCommune();
    });
    $("#commune").change(function () {
        getVillage();
    });
});
// function to get district
function getDistrict()
{
    // get district
    $.ajax({
        type: "GET",
        url: burl + "/company/getdistrict/" + $("#province").val(),
        success: function (data) {
            var opts = "";
            for(var i=0; i<data.length; i++)
            {
                opts +="<option value='" + data[i].id + "'>" + data[i].name + "</option>";
            }
            $("#district").html(opts);
            setTimeout(getCommune, 300);
        }
    });
}
// function to get commune
function getCommune()
{
    $.ajax({
        type: "GET",
        url: burl + "/company/getcommune/" + $("#district").val(),
        success: function (data) {
            var opts = "";
            for(var i=0; i<data.length; i++)
            {
                opts +="<option value='" + data[i].id + "'>" + data[i].name + "</option>";
            }
            $("#commune").html(opts);
            setTimeout(getVillage, 300);
        }
    });
}
// function to get village
function getVillage() {
    $.ajax({
        type: "GET",
        url: burl + "/company/getvillage/" + $("#commune").val(),
        success: function (data) {
            var opts = "";
            for(var i=0; i<data.length; i++)
            {
                opts +="<option value='" + data[i].id + "'>" + data[i].name + "</option>";
            }
            $("#village").html(opts);
        }
    });
}
// function save
function save() {
    var file_data = $('#photo').prop('files')[0];
    var form_data = new FormData();

    form_data.append('photo', file_data);
    form_data.append('code', $("#code").val());
    form_data.append('name', $("#name").val());
    form_data.append('other', $("#other").val());
    form_data.append('allow_no', $("#allow_no").val());
    form_data.append('allow_date', $("#allow_date").val());
    form_data.append('province_id', $("#province").val());
    form_data.append('province_name', $("#province :selected").text());
    form_data.append('district_id', $("#district").val());
    form_data.append('district_name', $("#district :selected").text());
    form_data.append('commune_id', $("#commune").val());
    form_data.append('commune_name', $("#commune :selected").text());
    form_data.append('village_id', $("#village").val());
    form_data.append('village_name', $("#village :selected").text());
    form_data.append('isallowed', $("#isallowed").val());
    form_data.append('street_no', $("#street_no").val());
    form_data.append('home_no', $("#home_no").val());
    var state = false;
    if(form_data.name!="" && form_data.code!="")
    {
        state=true;
    }
    if(state)
    {
        $("#sms").html("សូមរងចាំ <img src='" + burl + "/img/ajax-loader.gif'>");
        $.ajax({
            data: form_data,
            url: burl + "/company/save",
            type: 'POST',
            contentType: false,       // The content type used when sending data to the server.
            cache: false,             // To unable request pages to be cached
            processData: false,
            beforeSend: function (request) {
                return request.setRequestHeader('X-CSRF-Token', $("input[name='_token']").val());
            },
            success: function(response){
                $("#sms").html("<p class='text-success'>ទិន្នន័យត្រូវបានរក្សាទុកដោយជោគជ័យ</p>");
                // clear form
                $("#name").val("");
                $("#other").val("");
                $("#allow_no").val("");
                $("#allow_date").val("");
                $("#code").val("");
                document.getElementById("photo").src = "";
                $("#code").focus();

                setTimeout(function () {
                    $("#sms").html("");
                }, 3000);
            },
            error: function (sms) {
                alert(sms);
            }

        });
    }
    else{
        alert('ពត៌មានមិនត្រូវទេ សូមបំពេញពត៌មានឱ្យបានត្រឹមត្រូវ!');
    }


}
// function to preview image while selecting an image to upload
function loadFile(e){
    var output = document.getElementById('preview');
    output.width = 54;
    output.src = URL.createObjectURL(e.target.files[0]);
}