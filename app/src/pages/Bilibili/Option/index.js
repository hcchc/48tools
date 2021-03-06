/* B站直播间添加 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import { Input, Button, message, Spin, Form } from 'antd';
import style from './style.sass';
import { putBilibiliLiveRoom } from '../reducer/option';
import RoomId from './RoomId';

/* 初始化数据 */
const state = createStructuredSelector({});

/* actions */
const actions = (dispatch) => ({
  action: bindActionCreators({
    putBilibiliLiveRoom
  }, dispatch)
});

@Form.create()
@connect(state, actions)
class BiliBiliOption extends Component {
  static propTypes = {
    action: PropTypes.objectOf(PropTypes.func),
    form: PropTypes.object
  };

  constructor() {
    super(...arguments);

    this.state = {
      loading: false, // 加载动画
      btnLoading: false, // 按钮加载动画
      roomid: '', // 直播间id
      roomname: '' // 直播间名称
    };
  }

  // 添加
  handleAddClick(event) {
    event.preventDefault();
    this.setState({
      loading: true,
      btnLoading: true
    });

    this.props.form.validateFields(async (err, value) => {
      if (!err) {
        const { roomname, roomid } = value;

        try {
          await this.props.action.putBilibiliLiveRoom({
            data: {
              roomid: Number(roomid),
              roomname
            }
          });
          message.success('添加成功！');
          this.props.form.resetFields();
        } catch (err) {
          message.error('添加失败！');
        }
      } else {
        message.error('添加失败！');
      }
      this.setState({
        loading: false,
        btnLoading: false
      });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form; // 包装表单控件

    return (
      <div className={ style.body }>
        <Form className={ style.form } layout="horizontal" onSubmit={ this.handleAddClick.bind(this) }>
          <div>
            <Spin spinning={ this.state.loading } tip="加载中...">
              <Form.Item label="直播间名称">
                {
                  getFieldDecorator('roomname', {
                    initialValue: this.state.roomname,
                    rules: [
                      {
                        message: '必须输入直播间名称',
                        required: true,
                        whitespace: true
                      }
                    ]
                  })(
                    <Input />
                  )
                }
              </Form.Item>
              <Form.Item label="直播间ID">
                {
                  getFieldDecorator('roomid', {
                    initialValue: this.state.roomid,
                    rules: [
                      {
                        message: '必须输入直播间ID',
                        required: true,
                        whitespace: true
                      },
                      {
                        message: '必须输入有效的直播间ID',
                        pattern: /^[0-9]+$/i
                      }
                    ]
                  })(
                    <Input />
                  )
                }
              </Form.Item>
              <Form.Item>
                <p className={ style.tishi }>
                  ROOMID查看方式：https://api.live.bilibili.com/room/v1/Room/room_init?id={ '{{ ID }}' }，GET请求。
                </p>
              </Form.Item>
            </Spin>
          </div>
          <Form.Item>
            <Button className={ style.btn } type="primary" htmlType="submit" size="default" loading={ this.state.btnLoading }>添加</Button>
            <Link to="/BiliBili">
              <Button className={ style.btn } type="danger" size="default" loading={ this.state.btnLoading }>返回</Button>
            </Link>
          </Form.Item>
        </Form>
        <RoomId />
      </div>
    );
  }
}

export default BiliBiliOption;