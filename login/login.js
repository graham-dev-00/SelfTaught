
Validator.isRequired = function(selector) {

      return {
            selector: selector,
            test : function(value){
                 return value ? undefined : 'Vui lòng nhập trường này.';
            }
      };
}
Validator.isEmail = function(selector,message) {
      return {
            selector : selector,
            test : function(value){
                  let checkEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                  return checkEmail.test(value) ? undefined : message|| 'Trường này phải là email'
            }
      };
}

Validator.minPassword = function(selector,min,message){
            return {
                  selector:   selector,
                  test : function(value){
                        return value.length >= min ? undefined :message|| `Mật khẩu phải lớn hơn ${min} kí tự`;
                  }
            }
}

Validator.checkPassword = function(selector,getPassWordElement,message){
      return{
            selector:selector,
            test: function(value){
                  return value == getPassWordElement() ? undefined : message|| 'Thông tin không trùng khớp.';
            }
      }
}
function Validator (options) {
     
      var formElement = document.querySelector(options.form);
    if(formElement){
          options.rules.forEach(function(rule){
                let inputElement = formElement.querySelector(rule.selector);
    
                if(inputElement){
                      inputElement.onblur =function(){
                          validate(inputElement,rule);
                        }
                      inputElement.oninput = function(){
                        let errorElement=inputElement.parentElement.querySelector(options.errorSelector);
                        inputElement.parentElement.classList.remove('invalid');
                        errorElement.innerText =' ';

                      }
          }
    }
          )}
          function validate(inputElement,rule) {
            let errorMesseger=rule.test(inputElement.value);
            let errorElement=inputElement.parentElement.querySelector(options.errorSelector);
            if(errorMesseger){
                  inputElement.parentElement.classList.add('invalid');
                  errorElement.innerText= errorMesseger;
                  }
                  else{
                         inputElement.parentElement.classList.remove('invalid');
                         errorElement.innerText =' ';
                         
                  }
          }
}

