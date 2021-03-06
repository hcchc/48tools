import { createAction, handleActions } from 'redux-actions';
import { fromJS } from 'immutable';

/* 使用immutable初始化基础数据 */
const initData = {
  test: true
};

/* Action */
export const test = createAction('是否开启测试功能'); // 是否开启测试功能

/* reducer */
const reducer = handleActions({
  [test]: ($$state, action) => {
    return $$state.set('test', action.payload.test);
  }
}, fromJS(initData));

export default {
  index: reducer
};