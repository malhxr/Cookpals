import { Dimensions, Platform } from "react-native";

// export const BASE_URL = "https://cookpals.excellentwebworld.in/api/"
export const BASE_URL = "http://18.166.188.86/api/";
export const LOGIN_API = "login";
export const CHECK_EMAIL_API = "check-email";
export const SEND_OTP_API = "send-otp";
export const REGISTRATION_API = "register";
export const CHANGE_PASSWORD_API = "change-password";
export const CONTACT_US_API = "contact-us";
export const FORGOT_PASSWORD_API = "forgot-password";
export const PLANS_API = "plans";
export const RESEND_EMAIL_API = "resend-email";
export const MY_SUBSCRIPTION_API = "my-subscription";
export const ABOUT_US_API = "aboutus";
export const COUNTRY_API = "country";
export const CUISINE_API = "cuisine";
export const MEAL_API = "meal";
export const PREPARE_TIME_API = "preparation-time";
export const MY_PREFERENCE_API = "my-preference";
export const UPDATE_PROFILE_API = "update-profile";
export const POST_ADD_API = "post";
export const POST_EDIT_API = "post/edit/";
export const GET_ACTIVE_STATUS_API = "activity-status";
export const BOOK_MARK_API = "post-save";
export const GET_GENDER_API = "gender";
export const CHECK_EMAIL_VERIFY_API = "check-email-verify";
export const FAVOURITE_POST_API = "post-like";
export const HOME_API = "home";
export const MY_ACCOUNT_API = "my-account";
export const UPLOAD_VIDEO_API = "upload-video";
export const EDIT_FOOD_PREFERENCES = "edit-food-preference";
export const POST_DETAIL = "post/detail/";
export const POST_DELETE = "post/delete/";
export const LOGOUT_API = "logout";
export const SEARCH_API = "search";
export const LIKES_API = "user-likelist/";
export const USER_DETAILS = "user-detail/";
export const EXPLORE = "explore";
export const PROFILE_SEARCH_API = "profilesearch";
export const FOLLOW = "follow";
export const FOLLOWING = "following/";
export const NOTIFICATION = "notification";
export const READ_NOTIFICATION = "read-notification/";
export const REMOVE = "follow-remove";
export const USER_FUNNYPOST = "user-funnypost/";
export const RATING_POST = "post/ratingPost";
export const USER_LOCATION = "user-location";
export const NUMBER_CHECK = "number-check";
export const PROFILE_LIKE = "profile-like";
export const USER_CHATLIST = "user-chatlist";
export const USER_MESSAGE = "user-userMessage/";
export const GROUP_LIST = "group-list";
export const GROUP_MESSAGE_LIST = "groupchat-message";
export const CREATE_GROUP = "create-group";
export const EDIT_GROUP = "group-edit";
export const ADD_CHAT_FOLLOWERS_LIST = "add-chat-follwers-list/";
export const SINGLE_CHAT_DELETE = "singalchat-delete/";
export const GROUP_CHAT_DELETE = "groupchat-delete/";
export const GROUP_USER_REMOVE = "group-user-remove/";

export const USER_MATCH = "user-match";
export const CHAT_BASE_URL = "http://18.166.188.86:3000";
export const SEND_INVITATION = "send-invitation";

export const WEIGHT_API = "weight";

export const BEARER = "Bearer ";
export function debugLog() {
  for (var i = 0; i < arguments.length; i++) {
    console.log(arguments[i]);
  }
}

const { width, height } = Dimensions.get("window");

const guidelineBaseWidth = 360;
const guidelineBaseHeight = 760;
const scale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// CHANGE FONT SIZE IN ANDROID
export function getProportionalFontSize(baseFontSize) {
  var intialFontSize = baseFontSize || 14;
  // if (Platform.OS === 'ios') {
  // heightPercentageToDP(fontSizeToReturn );
  // }
  var fontSizeToReturnModerate = moderateScale(intialFontSize);
  var fontSizeToReturnVertical = verticalScale(intialFontSize);
  return Platform.OS == "ios"
    ? fontSizeToReturnModerate
    : fontSizeToReturnVertical;
}
