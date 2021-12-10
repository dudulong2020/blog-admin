import React, { useState, useEffect } from 'react';
import '../static/css/ArticleList.css'
import { useNavigate, } from "react-router-dom";
import { List, Row, Col, Modal, message, Button, Switch, Table, Tag, Space } from 'antd';
import axios from 'axios'
import servicePath from './config/apiUrl';
const { confirm } = Modal;

const ArticleList= () => {

  let navigate = useNavigate();

  const [list, setList] = useState([])

  //获取文章列表
  const getList = () => {
    axios({
      method: 'get',
      url: servicePath.getArticleList,
      withCredentials: true,
      header: { 'Access-Control-Allow-Origin': '*' }
    }).then(
      res => {
        setList(res.data.list)

      }
    )
  }

  //删除文章的方法
  const delArticle = (id) => {
    confirm({
      title: '确定要删除这篇博客文章吗?',
      content: '如果你点击OK按钮，文章将会永远被删除，无法恢复。',
      onOk() {
        axios(servicePath.delArticle + id, { withCredentials: true }).then(
          res => {
            message.success('文章删除成功')
            getList()
          }
        )
      },
      onCancel() {
        message.success('没有任何改变')
      },
    });

  }

  const updateArticle = (id, checked) => {

    navigate('/article/add/' + id)

  }


  useEffect(() => {
    getList()
  }, [])


  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: text => <a>{text}</a>,
    },
    {
      title: '类别',
      dataIndex: 'typeName',
      key: 'typeName',
    },
    
    {
      title: '发布时间',
      dataIndex: 'addTime',
      key: 'addTime',
    },
    {
      title: '浏览量',
      dataIndex: 'view_count',
      key: 'view_count',
    },
    // {
    // {
    //   title: 'Tags',
    //   key: 'tags',
    //   dataIndex: 'tags',
    //   render: tags => (
    //     <>
    //       {tags.map(tag => {
    //         let color = tag.length > 5 ? 'geekblue' : 'green';
    //         if (tag === 'loser') {
    //           color = 'volcano';
    //         }
    //         return (
    //           <Tag color={color} key={tag}>
    //             {tag.toUpperCase()}
    //           </Tag>
    //         );
    //       })}
    //     </>
    //   ),
    // },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a onClick={()=>{updateArticle(record.id)}} >修改 </a>
          <a onClick={() => { delArticle(record.id) }}>删除</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <List
        header={
          <Row className="list-div">
            <Col span={8}>
              <b>标题</b>
            </Col>
            <Col span={3}>
              <b>类别</b>
            </Col>
            <Col span={3}>
              <b>发布时间</b>
            </Col>
            <Col span={3}>
              <b>集数</b>
            </Col>
            <Col span={3}>
              <b>浏览量</b>
            </Col>

            <Col span={4}>
              <b>操作</b>
            </Col>
          </Row>

        }
        bordered
        dataSource={list}
        renderItem={item => (
          <List.Item>
            <Row className="list-div">
              <Col span={8}>
                {item.title}
              </Col>
              <Col span={3}>
                {item.typeName}
              </Col>
              <Col span={3}>
                {item.addTime}
              </Col>
              <Col span={3}>
                共<span>{item.part_count}</span>集
                          </Col>
              <Col span={3}>
                {item.view_count}
              </Col>

              <Col span={4}>
                <Button type="primary" onClick={()=>{updateArticle(item.id)}} >修改</Button>&nbsp;
                <Button onClick={() => { delArticle(item.id) }} >删除 </Button>
              </Col>
            </Row>

          </List.Item>
        )}
      />


      <Table columns={columns} dataSource={list} />,
    </div>
  )

}

export default ArticleList