import * as actiontypes from '../actions/actionsTypes';
import {updateObject} from '../../shared/utility'

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
    authRedirectPath: '/'
};

const setAuthRedirect = (state,action) => {
    return updateObject(state,{authRedirectPath: action.path})
}

const authSuccess = (state,action) => {
    return updateObject (state, {
        token:action.idToken,
        userId: action.userId,
        error: null,
        loading: false
    }); 
}

const authFail = (state, action) => {
    return updateObject ( state, {
        error:action.error,
        loading:false
    })
}

const authLogout = (state,action) => {
    return updateObject(state, {token: null, userId:null})
};

const reducer = (state=initialState, action) => {
    switch (action.type) {
        case actiontypes.AUTH_START:
            return updateObject(state, {error: null, loading: true});
        case actiontypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actiontypes.AUTH_FAIL: return authFail(state, action);
        case actiontypes.AUTH_LOGOUT: return authLogout(state,action);
        case actiontypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirect(state,action);
        default:
            return state;
    }
}

export default reducer