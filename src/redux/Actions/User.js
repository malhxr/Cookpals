
export const SAVE_USER_LOGGEDIN = "SAVE_USER_LOGGEDIN"
export function saveUserLoggedInInRedux(data){
    return{
        type: SAVE_USER_LOGGEDIN,
        isLoggedIn: data
    }
}

export const SAVE_USER_TOKEN = "SAVE_USER_TOKEN"
export function saveUserDetailInRedux(data){
    return{
        type: SAVE_USER_TOKEN,
        detail: data
    }
}
export const SAVE_NOTIFICATION = "SAVE_NOTIFICATION"
export const saveNotificationInRedux = (data) => {
    return{
        type:SAVE_NOTIFICATION,
        notification:data
    }
}
export const SAVE_POST = "SAVE_POST"
export const savePostInRedux = (data) => {
    return{
        type:SAVE_POST,
        post:data
    }
}