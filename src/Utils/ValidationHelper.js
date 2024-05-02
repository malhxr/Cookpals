


class ValidationHelper {

    emailValidation = (value, message) => {

        var email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (value.trim() == "") {
            return "Please enter email address"
        } else if (!value.match(email)) {
            return "Please enter valid email address"
        }
        return ""
    }

    passwordValidation = (value, message) => {
        // var strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
        // var mediumRegex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
        if (value.trim() == "") {
            return "Please enter a password"
        }
        else if (value === "undefined" || value.length < 8) {
            return "Password must contain at least 8 characters"
        }
        // else if (!value.match(strongRegex || mediumRegex)) {
        //     return strings("general.weakPassword");
        // }
        return ""
    }

    confirmPasswordValidation = (value, confirmValue, message) => {
        
        if (confirmValue.trim() == "") {
            return "Please enter a confirm password"
        } else if (value.trim() !== confirmValue.trim()) {
            return "New password and confirm password should be the same"
        }
        return ""
    }

    isEmptyValidation = (value, message) => {
        // var name = /[^a-zA-Z0-9 ]/;
        // var name = /^([a-zA-Z0-9\s@,=%$#&_\u0621-\u064A\u0660-\u0669-\u0600-\u06ff-\u064A0-9\s\p{N}]).{0,30}$/;
        // var name = /^[\p{Arabic}\s\p{N}]+$/;
        var name = /[!@#$ %^&*()_+\-=\[\]{};':"\\|,.<>\/?] +/;
        // console.log(" ::::::: ",value.trim(),name.test(value) );
        // if (name.test(value)) {
        //     return strings("general.specialCharacter")
        // }
        return value.trim() == "" ? message : ""
    }

    fullNameValidation = (value) => {
        if (value.trim() == '') {
            return 'Please enter your bio'
        } else if ( value.length < 2  ) {
            return 'Minimum 2 characters are allowed'
        }
        return ""
    }


    mobileValidation = (value) => {
        // let phoneno = /^\d{10}$/;
        if (value.trim() == "") {
            return "Please enter mobile no."
        } else if (value.length < 10) {
            return "Please enter 10 digit number"
        }
        return ""

    }

    descriptionValidation = (value) => {
        if (value.trim() == '') {
            return 'Please enter your bio'
        } else if ( value.length < 5  ) {
            return 'Minimum 5 characters are allowed'
        }
        return ""
    }
}

export default ValidationHelper;