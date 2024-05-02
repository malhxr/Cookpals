import messaging from '@react-native-firebase/messaging';
import { debugLog } from './CPConstant';


export const checkFirebaseServices = async (
    onSuccessFirebaseHandler,
    onFailureFirebaseHandler,
) => {
    requestPermission(
        token => {
            debugLog("Firebase Token ::::::::: ", token)
            onSuccessFirebaseHandler(token);
        },
        error => {
            onFailureFirebaseHandler(error);
        },
    );
};

async function requestPermission(
    onSuccessPermissionHandler,
    onFailurePermissionHandler,
) {
    await messaging()
        .requestPermission()
        .then((response) => {
            console.log("AUTHORIZATION ::::::: ", response);
            getToken(
                token => {
                    onSuccessPermissionHandler(token);
                },
                error => {
                    onFailurePermissionHandler(error);
                },
            );
        })
        .catch(error => {
            onFailurePermissionHandler(error);
        });
}

async function getToken(onSuccessTokenHandler, onFailureTokenHandler) {
    await messaging()
        .getToken()
        .then(token => {
            onSuccessTokenHandler(token);
        })
        .catch(error => {
            onFailureTokenHandler(error);
        });
}
