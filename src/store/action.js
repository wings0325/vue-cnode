import axios from 'axios'
import * as types from "./mutation-types"

axios.defaults.baseURL = "https://cnodejs.org/api/v1";

//更换当前活动的tab
export const toogleTab = ({ dispatch, commit, state }, data) => {
	commit(types.SET_ACTIVE_TAB, data);
	
	console.log('要显示的tab:'+data.tab);
	console.log('要显示tab的数组长度:'+state.topic.topicLists[data.tab].data.length);
	if (state.topic.topicLists[data.tab].data.length === 0) {
		dispatch('fetchTopicList');
	}
	
}

//请求主题列表
export const fetchTopicList = ({ dispatch, commit, state }) => {
	dispatch('setIsLoading');
	let activeTab = state.topic.tabs.filter(({isActive}) => isActive)[0];

	return new Promise((resolve, reject) => {
		axios.get('/topics', {
			params: {
				page: state.topic.topicLists[activeTab.tab].page,
				tab: activeTab.tab,
				limit: 15,
				mdrender: true,
			}
		}).then( res => {
			if (res.data.success) {
				commit(types.UPDATE_LIST, {tab: activeTab.tab, list: res.data.data});
				resolve(res);
			} 
			dispatch('setIsLoading');
		}).catch( err => {
			dispatch('setIsLoading');
		  reject(err);
		});
	})
}

//记录当前活动列表的滚动位置
export const updateScrollTop = ({ commit }, data) => {
	commit(types.UPDATE_SCROLL_TOP, data)
}

//设置列表加载状态
export const setIsLoading = ({ commit }) => {
	commit(types.SET_IS_LOADING)
}

//登录
export const login = ({ commit }, token) => {
	return new Promise((resolve, reject) => {
		axios.post('/accesstoken', {
			accesstoken: token
		}).then(res => {
			let userInfo = res.data;
			commit(types.SET_USER_INFO, {
				id: userInfo.id,
				token: token,
				loginname: userInfo.loginname,
				avatar_url: userInfo.avatar_url,
			});
			resolve();
		}).catch( err => {
			reject(err);
		})
	});
}

//注销
export const logOut = ({ commit }) => {
	commit(types.LOGOUT);
}
//获取用户信息
export const getUserInfo = ({ commit }, userName) => {
	/*return new Promise((resolve, reject) => {
		axios.get('/user/'+userName).then( res => {
			if (res.data.success) {
				resolve(res.data.data);
			}
		}).catch( err => {
			reject(err);
		})	
	});*/
	return axios.get('/user/'+userName);
}


