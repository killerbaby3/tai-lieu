var SignUpForm = {};

$(document).ready(function(){
    SignUpForm = {
        publish_key_captch: '6LeWJaMUAAAAAPZyq3e_aKp-eGKJQ3Lz4oyC9WZJ',
        form: $('#signupForm'),
        checkFullName: (el_id) => {
            var valid = false
            , fullnameEl = $(`#${el_id}`)
            ;
            var fullname = fullnameEl.val().trim();
            if (!SignUpForm.isRequired(fullname)) {
                SignUpForm.showError(fullnameEl, '*Thiếu thông tin');
            } else {
                SignUpForm.showSuccess(fullnameEl);
                valid = true;
            }
            return valid;
        },
        checkPhone: (el_id) => {
            var valid = false
            , phoneEl = $(`#${el_id}`)
            ;
            var phone = phoneEl.val().trim();
            if (!SignUpForm.isRequired(phone)) {
                SignUpForm.showError(phoneEl, '*Thiếu thông tin');
            } else if (isNaN(phone) == true || phone.length < 10 || phone.length > 11) {
                SignUpForm.showError(phoneEl, '*Số điện thoại không hợp lệ')
            } else {
                SignUpForm.showSuccess(phoneEl);
                valid = true;
            }
            return valid;
        },
        checkIdentifyNumber: (el_id) => {
            var valid = false
            , identify_numberEl = $(`#${el_id}`)
            , isUnder15 = $('.under15_tab li.active').attr('data-under-15')
            ;
            if(isUnder15 == 1){
                var identify = $('[name="identify_guar"]:checked').val().trim()
            }
            else{
                var identify = $('[name="identify"]:checked').val().trim()
            }
            var identify_number = identify_numberEl.val().trim()
            ;
            if (!SignUpForm.isRequired(identify_number)) {
                SignUpForm.showError(identify_numberEl, '*Thiếu thông tin');
            } else {
                if(identify == 'passport'){
                    if(identify_number.length != 8){
                        SignUpForm.showError(identify_numberEl, '*Hộ chiếu/Passport không hợp lệ')
                    }else{
                        SignUpForm.showSuccess(identify_numberEl);
                        valid = true;
                    }
                }else{
                    if(identify_number.length < 9 || (identify_number.length > 9 && identify_number.length != 12)){
                        SignUpForm.showError(identify_numberEl, '*CMND/CCCD không hợp lệ')
                    }else{
                        SignUpForm.showSuccess(identify_numberEl);
                        valid = true;
                    }
                }
            }
            return valid;
        },
        checkBirthday: (el_id) => {
            var valid = false
            , birthdayEl = $(`#${el_id}`)
            ;
            var title = birthdayEl.val().trim();
            if (!SignUpForm.isRequired(title)) {
                SignUpForm.showError(birthdayEl, '*Thiếu thông tin');
            } else {
                SignUpForm.showSuccess(birthdayEl);
                valid = true;
            }
            return valid;
        },
        checkAddress: (el_id) => {
            var valid = false
            , addressEl = $(`#${el_id}`)
            ;
            var title = addressEl.val().trim();
            if (!SignUpForm.isRequired(title)) {
                SignUpForm.showError(addressEl, '*Thiếu thông tin');
            } else {
                SignUpForm.showSuccess(addressEl);
                valid = true;
            }
            return valid;
        },
        checkUpload: (el_id) => {
            var valid = false
            , uploadEl = $(`#${el_id}`)
            ;
            var thumbnail = uploadEl.val().trim();
            if (!SignUpForm.isRequired(thumbnail)) {
                SignUpForm.showError(uploadEl, '*Thiếu thông tin');
            }
            else if(uploadEl.hasClass('upload_fail')){
                SignUpForm.showError(uploadEl, 'Tải ảnh thất bại, vui lòng thử lại.');
            }
            else if(uploadEl.hasClass('uploading')){
                SignUpForm.showError(uploadEl, 'Vui lòng chờ ảnh tải lên hoàn tất.');
            }
            else{
                SignUpForm.showSuccess(uploadEl);
                valid = true;
            }
            return valid;
        },
        checkTitle: (el_id) => {
            var valid = false
            , titleEl = $(`#${el_id}`)
            ;
            var title = titleEl.val().trim();
            if (!SignUpForm.isRequired(title)) {
                SignUpForm.showError(titleEl, '*Thiếu thông tin');
            } else if (title.split(' ').length > 12) {
                SignUpForm.showError(titleEl, '*Số từ vượt quá quy định')
            } else {
                SignUpForm.showSuccess(titleEl);
                valid = true;
            }
            return valid;
        },
        checkContent: (el_id) => {
            var valid = false
            , contentEl = $(`#${el_id}`)
            ;
            var content = contentEl.val().trim();
            if (!SignUpForm.isRequired(content)) {
                SignUpForm.showError(contentEl, '*Thiếu thông tin');
            } else if (content.split(' ').length > 100) {
                SignUpForm.showError(contentEl, '*Số từ vượt quá quy định')
            } else {
                SignUpForm.showSuccess(contentEl);
                valid = true;
            }
            return valid;
        },
        checkEmail: (el_id) => {
            var valid = false
            , emailEl = $(`#${el_id}`)
            ;
            var email = emailEl.val().trim();
            if (!SignUpForm.isRequired(email)) {
                SignUpForm.showError(emailEl, '*Thiếu thông tin');
            } else if (!SignUpForm.isEmailValid(email)) {
                SignUpForm.showError(emailEl, '*Sai định dạng')
            } else {
                SignUpForm.showSuccess(emailEl);
                valid = true;
            }
            return valid;
        },
        isEmailValid: (email) => {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        isRequired: value => {
            return value === '' ? false : true;
        },
        isBetween: (length, min, max) => {
            return length < min || length > max ? false : true;
        },
        showError: (input, message) => {
            // get the form-field element
            var formInput = input.parents('.form-input');
            // add the error class
            formInput.removeClass('success');
            formInput.addClass('error');

            // show the error message
            formInput.find('.txt-error').html(message);
        },
        showSuccess: (input) => {
            // get the form-field element
            var formInput = input.parents('.form-input');

            // remove the error class
            formInput.removeClass('error');
            formInput.addClass('success');

            // hide the error message
            formInput.find('txt-error').html('');
        },
        debounce: (fn, delay = 500) => {
            var timeoutId;
            return (...args) => {
                // cancel the previous timer
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                // setup a new timer
                timeoutId = setTimeout(() => {
                    fn.apply(null, args)
                }, delay);
            };
        },
        resetForm: () => {
            SignUpForm.form.find('.form-input.error').removeClass('error');
            SignUpForm.form.trigger("reset");
            $('#thumbnail_url').val('');
            $('#agree').prop('checked', false)
            $('#fine-uploader-gallery').fineUploader('reset');
        },
        showLightBox: (tpl) => {
            if('object' == typeof($.magnificPopup)){
                $.magnificPopup.open({
                    items: {
                        src: tpl, // can be a HTML string, jQuery object, or CSS selector
                    },
                    mainClass: 'mfp-with-zoom',
                    type:'inline',
                    midClick: true, // Allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source in href.
                    fixedContentPos: false,
                    fixedBgPos: true,
                    overflowY: 'auto',
                    closeBtnInside: true,
                    preloader: false,
                    removalDelay: 300
                });
            }
        },
        loadCaptchaV3: (publish_key_captch, callback) => {
            if(typeof grecaptcha != 'undefined' && $('#_token_').length){
                grecaptcha.execute(publish_key_captch, {action: 'homepage'}).then(function(token) {
                    $('#_token_').val(token);
                    if(typeof callback == 'function'){
                        callback(token);
                    }
                });
                return;
            }

            try
            {
                var addHeadScript = function(src, func) {
                    var script = document.createElement('script');
                    script.async = "async";
                    script.src = src;
                    if (func) {
                    script.onload = func;
                    }
                    document.getElementsByTagName("head")[0].appendChild( script );
                }
                addHeadScript( "https://www.google.com/recaptcha/api.js?render=" + publish_key_captch, function() {
                    grecaptcha.ready(function() {

                        $('.grecaptcha-badge').hide();
                        if($('input#_token_').length == 0){
                            $('<input>').attr({
                                type: 'hidden',
                                id: '_token_',
                                name: '_token_'
                            }).appendTo('body');
                        }
                        grecaptcha.execute(publish_key_captch, {action: 'homepage'}).then(function(token) {
                            $('#_token_').val(token);
                            if(typeof callback == 'function'){
                                callback(token);
                            }
                        });
                    });
                });
            }
            catch( e ){console.log('loadCaptchaV3', e)}
        }
    }

    var fileAllowed = ['jpeg', 'jpg', 'png']
        , arr_Img = []
        ;
    $('#fine-uploader-gallery').fineUploader({
        template: 'qq-template-gallery',
        request: {
            endpoint: '//upload.vnexpress.net/photo',
            params: {
                response: "json",
                campaignresize: 1024
            }
        },
        onLeave: false,
        validation: {
            allowedExtensions: fileAllowed,
            sizeLimit: 6000000,
            minSizeLimit: 10,
            itemLimit: 10,
            // image:{
            //     minWidth: 900,
            //     minHeight: 900,
            //     maxWidth: 2048,
            //     maxHeight: 2048
            // }
        },
        messages: {
            tooManyItemsError: "Bạn được tải lên tối đa {itemLimit} ảnh",
            typeError: "*Sai định dạng. Định dạng ảnh được phép tải lên: jpeg, jpg, png.",
            sizeError: "Dung lượng cho phép 6MB.",
            minSizeError: "Dung lượng tối thiểu 1MB",
            maxHeightImageError: "Kích thước tối đa: 2048x2048 pixel",
            maxWidthImageError: "Kích thước tối đa: 2048x2048 pixel",
            minHeightImageError: "Kích thước tối thiểu 900x900 pixel",
            minWidthImageError: "Kích thước tối thiểu 900x900 pixel"
        },
        callbacks: {
            onCancel: function(id, name) {
                delete arr_Img[id];
                if (arr_Img.length > 0) {
                    var listImageStr = '';
                    $.each(arr_Img, function(k, v) {
                        if (v != '' && typeof v != 'undefined') {
                            listImageStr += v + ' ';
                        }
                    });
                    $('#thumbnail_url').val(listImageStr.trim());
                } else {
                    $('#thumbnail_url').val('');
                }
            },
            onUpload: function(id, xhr) {
                $('#thumbnail_url').addClass('uploading');
            },
            onComplete: function(id, xhr, response) {
                if (response.success) {
                    $('#thumbnail_url').val($('#thumbnail_url').val() + ' ' + response.url);
                    arr_Img[id] = response.url;
                    //console.log(arr_Img);
                    // Xử lý preview thumbnail
                    var listFile = $('#thumbnail_url').val().split(' ');
                    // console.log('onComplete: ', arr_Img);
                    $('#fine-uploader-gallery').find('.item_upload').each(function(k, v) {
                        ++k;
                        var src = $(this).find('img').attr('src');
                        // if(!src)
                        // {
                        // setTimeout(function(){
                        // var filename = listFile[k].replace(/\?.*$/, '').split('/').pop();
                        // $(this).find('.qq-thumbnail-wrapper').empty().html('<div class="qq-file" valign="middle" style="margin-top: 30px;font-size: 12px;color: #9F224E;"><i class="ic ic-m-news"></i>'+filename+'</div>');
                        // }, 300);
                        // }
                    });
                } else {
                    console.log('Tải lên thất bại', response);
                }
            },
            onAllComplete: function(succeeded, failed) {
                // console.log('onAllComplete: ', succeeded, failed);
                // console.log('onAllComplete arr_Img: ', arr_Img);
                $('#thumbnail_url').removeClass('uploading');
                var uploadEl = $('#thumbnail_url')
                SignUpForm.showSuccess(uploadEl);
                if(succeeded.length == arr_Img.length){
                    $('#thumbnail_url').addClass('upload_all_done');
                    // console.log('All files uploaded')
                }
                else{
                    // $('#thumbnail_url').addClass('upload_fail');
                    // console.log('Tải lên thất bại, hãy thử lại sau ít phút nữa');
                }
            },
            onError: function(fileId, filename, reason, maybeXhr) {
                //do something with the error
                console.log('onError', fileId, filename, reason, maybeXhr)
                // this.clearStoredFiles()
            }
        },
        showMessage: function(message){
            var uploadEl = $('#thumbnail_url')
            SignUpForm.showError(uploadEl, message);
        }
        //debug: true
    });

    SignUpForm.form.on('input', SignUpForm.debounce(function (e) {
        switch (e.target.id) {
            case 'fullname':
            case 'fullname_guar':
                SignUpForm.checkFullName(e.target.id);
                break;
            case 'email_guar':
            case 'email':
                SignUpForm.checkEmail(e.target.id);
                break;
            case 'phone':
            case 'phone_guar':
                SignUpForm.checkPhone(e.target.id);
                break;
            case 'birthday':
                SignUpForm.checkBirthday(e.target.id);
                break;
            case 'address':
                SignUpForm.checkAddress(e.target.id);
                break;
            case 'identify_number_guar':
            case 'identify_number':
                SignUpForm.checkIdentifyNumber(e.target.id);
                break;
            case 'title':
                SignUpForm.checkTitle(e.target.id);
                break;
            case 'content':
                SignUpForm.checkContent(e.target.id);
                break;
        }
    }));

    $(document).on('click', '#sendForm', function(){
        var _self = $(this);
        if(_self.hasClass('sending')) return;

        // validate forms
        var isTitleValid = SignUpForm.checkTitle('title')
            , isContentValid = SignUpForm.checkContent('content')
            , isUploadValid = SignUpForm.checkUpload('thumbnail_url')
            , isAgree = $('#agree').is(':checked')
            ;

        var isFormValid = isTitleValid
                && isContentValid
                && isUploadValid
            ;

        var isUsernameValid = SignUpForm.checkFullName('fullname')
            , isEmailValid = SignUpForm.checkEmail('email')
            , isPhoneValid = SignUpForm.checkPhone('phone')
            , isIdentifyNumberValid = SignUpForm.checkIdentifyNumber('identify_number');
        isFormValid = isFormValid && isUsernameValid && isEmailValid && isPhoneValid && isIdentifyNumberValid;

        // submit to the server if the form is valid
        if (isFormValid) {
            if(!isAgree){
                $('.check-agree').addClass('error')
                return;
            }
            $('.check-agree').removeClass('error');
            console.log('::::::::Form OK::::::::');
        }
        else{
            $('.form-input.error:first').find('input').focus();
        }
    });

});