
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
      function getParentElement(element,selector){
            while(element.parentElement){
                  if(element.parentElement.matches(selector)){
                        return element.parentElement;
                  }
                  element= element.parentElement;
            }
      }
      let selectorRules = {};
      function validate(inputElement,rule) {
            let errorElement=getParentElement(inputElement,options.formGroupSelector).querySelector(options.errorSelector);
            let errorMesseger;
            let rules = selectorRules[rule.selector]; // mảng chứa các rule
            for(let i =0 ; i< rules.length;++i){
                  errorMesseger=rules[i](inputElement.value); //chạy vòng lặp để xét các rule trong mảng
                  if(errorMesseger) // Nếu tồn tại một rule nào đó thì break
                        break;
            }
            if(errorMesseger){
                  getParentElement(inputElement,options.formGroupSelector).classList.add('invalid');
                  errorElement.innerText= errorMesseger;
                  }
                  else{
                        getParentElement(inputElement,options.formGroupSelector).classList.remove('invalid');
                         errorElement.innerText =' ';
                         
                  }
            return !errorMesseger; //!undefine tra ve true !!undefine tra ve false
          }
      let selectorRule = {}; // tạo một object chứa các rule để tránh việc bị ghi đè ở sự kiện onblur,để có thể áp dụng nhiều rule cho một trường
      var formElement = document.querySelector(options.form);
     
    if(formElement){
      //Viet cho su kien submit
      formElement.onsubmit = function(e){
            e.preventDefault();
            let checkFormError = true;
            options.rules.forEach(function(rule){
                  let inputElement = formElement.querySelector(rule.selector);
                 let checkError= validate(inputElement,rule);
                 // !checkError boi vi neu co loi thi errorMesserger se la false va them ! se la nguoc lai khi day se chay cau lenh nay
                 //check xem form co xay ra loi hay khong
                  if(!checkError){ 
                        checkFormError =false;
                  }
            });
            if(checkFormError){
                 if(typeof options.onSubmit ==='function'){
                   let inputsValueElement = formElement.querySelectorAll('[name]');
                   let inputsValue = Array.from(inputsValueElement).reduce(function(values,input){
                        values[input.name]= input.value;
                         return values;
                   },{});
                  options.onSubmit(inputsValue);
                   
                 }
            }
            
            
      }
          options.rules.forEach(function(rule){
            
                let inputElement = formElement.querySelector(rule.selector);
                //Lưu lại các rule cho mỗi input để tránh việc bị ghi đè ở sự kiện onblur
                if(Array.isArray(selectorRules[rule.selector])){
                      // Nếu rule có rule.selector được chạy hai lần tức là value của nó với key là rule.selector đã là một mảng thì sẽ vào đây
                      // Push rule tiếp theo ứng với rule.selector vào mảng
                        selectorRules[rule.selector].push(rule.test);
                }
                else{
                      //lần đầu tiên vòng lặp chạy sẽ chạy dòng này,sẽ thêm value của key rule.selector thành một mảng
                  selectorRules[rule.selector] = [rule.test];
                }
               
                if(inputElement){
                      inputElement.onblur =function(){
                          validate(inputElement,rule);
                        }
                      inputElement.oninput = function(){
                        let errorElement=getParentElement(inputElement,options.formGroupSelector).querySelector(options.errorSelector);
                        getParentElement(inputElement,options.formGroupSelector).classList.remove('invalid');
                        errorElement.innerText =' ';

                      }
          }
    }  
          )   
}
}


