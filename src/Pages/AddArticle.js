import React, { useEffect, useState } from 'react';
import { useNavigate,useParams } from "react-router-dom";
import axios from 'axios';
import servicePath from './config/apiUrl';

import '../static/css/AddArticle.css'
import { Row, Col, Input, Select, Button, DatePicker, message } from 'antd'

import { marked } from 'marked'
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css';
// import 'highlight.js/styles/github-dark.css';
// import hljs from 'highlight.js/lib/core';
// import javascript from 'highlight.js/lib/languages/javascript';

const { Option } = Select;
const { TextArea } = Input

// hljs.registerLanguage('javascript', javascript);

marked.setOptions({
  renderer: new marked.Renderer(),
  // highlight: function (code, lang) {
  //   // const hljs = require('highlight.js');
  //   const language = hljs.getLanguage(lang) ? lang : 'plaintext';
  //   return hljs.highlight(code, { language }).value;
  // },
  gfm: true,
  pedantic: false,
  sanitize: false,
  tables: true,
  breaks: false,
  smartLists: true,
  smartypants: false,
  langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
  xhtml: false,
  // highlight: 高亮显示规则 ，这里我们将使用highlight.js来完成
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  }
});


const AddArticle = () => {

  let navigate = useNavigate();
  const params = useParams();

  const [articleId, setArticleId] = useState(0)  // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
  const [articleTitle, setArticleTitle] = useState('')   //文章标题
  const [articleContent, setArticleContent] = useState('')  //markdown的编辑内容
  const [markdownContent, setMarkdownContent] = useState('预览内容') //html内容
  const [introducemd, setIntroducemd] = useState()            //简介的markdown内容
  const [introducehtml, setIntroducehtml] = useState('等待编辑') //简介的html内容
  const [showDate, setShowDate] = useState()   //发布日期
  const [updateDate, setUpdateDate] = useState() //修改日志的日期
  const [typeInfo, setTypeInfo] = useState([]) // 文章类别信息
  const [selectedType, setSelectType] = useState(1) //选择的文章类别

  const getTypeInfo = () => {
    axios({
      method: 'get',
      url: servicePath.getTypeInfo,
      // data: dataProps,
      header: { 'Access-Control-Allow-Origin': '*' },
      withCredentials: true
    }).then(
      res => {
        if (res.data.data == '没有登录') {
          localStorage.removeItem('openId')
          navigate('/');
        } else {
          setTypeInfo(res.data.data)
        }
      }
    )
  }

  useEffect(() => {
    getTypeInfo()
    // let tmpId = props.match.params.id
    if (params.id) {
      setArticleId(params.id)
      getArticleById(params.id)
    }
  }, [])

  const changeContent = (e) => {
    setArticleContent(e.target.value)
    let html = marked(e.target.value)
    setMarkdownContent(html)
  }

  const changeIntroduce = (e) => {
    setIntroducemd(e.target.value)
    let html = marked(e.target.value)
    setIntroducehtml(html)
  }

  const selectTypeHandler = (value) => {
    setSelectType(value)
  }

  const saveArticle = () => {
    if (!selectedType) {
      message.error('必须选择文章类别')
      return false
    } else if (!articleTitle) {
      message.error('文章名称不能为空')
      return false
    } else if (!articleContent) {
      message.error('文章内容不能为空')
      return false
    } else if (!introducemd) {
      message.error('简介不能为空')
      return false
    } else if (!showDate) {
      message.error('发布日期不能为空')
      return false
    }

    message.success('检验通过')

    let dataProps = {}   //传递到接口的参数
    dataProps.type_id = selectedType
    dataProps.title = articleTitle
    dataProps.content = articleContent
    dataProps.introduce = introducemd
    // let datetext = showDate.replace('-', '/') //把字符串转换成时间戳
    // dataProps.addTime = (new Date(datetext).getTime()) / 1000

    dataProps.addTime = showDate

    if (articleId === 0) {
      console.log('articleId=:' + articleId)
      dataProps.view_count = Math.ceil(Math.random() * 100) + 1000
      axios({
        method: 'post',
        url: servicePath.addArticle,
        data: dataProps,
        withCredentials: true
      }).then(
        res => {
          setArticleId(res.data.insertId)
          if (res.data.isScuccess) {
            message.success('文章添加成功')
          } else {
            message.error('文章保存失败');
          }

        }
      )
    } else {
      dataProps.id = articleId
      axios({
        method: 'post',
        url: servicePath.updateArticle,
        header: { 'Access-Control-Allow-Origin': '*' },
        data: dataProps,
        withCredentials: true
      }).then(
        res => {

          if (res.data.isScuccess) {
            message.success('文章修改成功')
          } else {
            message.error('保存失败');
          }


        }
      )
    }


  }


  const getArticleById = (id) => {
    axios(servicePath.getArticleById + id, {
      withCredentials: true,
      header: { 'Access-Control-Allow-Origin': '*' }
    }).then(
      res => {
        //let articleInfo= res.data.data[0]
        setArticleTitle(res.data.data[0].title)
        setArticleContent(res.data.data[0].article_content)
        let html = marked(res.data.data[0].article_content)
        setMarkdownContent(html)
        setIntroducemd(res.data.data[0].introduce)
        let tmpInt = marked(res.data.data[0].introduce)
        setIntroducehtml(tmpInt)
        setShowDate(res.data.data[0].addTime)
        setSelectType(res.data.data[0].typeId)

      }
    )
  }


  return (
    <div>
      <Row gutter={5}>
        <Col span={18}>
          <Row gutter={10} >
            <Col span={20}>
              <Input
                value={articleTitle}
                placeholder="博客标题"
                onChange={e => {
                  setArticleTitle(e.target.value)
                }}
                size="large" />
            </Col>
            <Col span={4}>
              &nbsp;
                <Select defaultValue="类型" size="large" onChange={selectTypeHandler}>
                {
                  typeInfo.length ? typeInfo.map((item) => {
                    return (
                      <Option key={item.id} value={item.id}>{item.typeName}</Option>
                    )
                  }) : ""
                }
              </Select>
            </Col>
          </Row>
          <br />
          
          <Row gutter={10} >
            <Col span={12}>
              <TextArea
                className="markdown-content"
                rows={35}
                placeholder="文章内容"
                value={articleContent}
                onChange={changeContent}
                onPressEnter={changeContent}
              />
            </Col>
            <Col span={12}>
              <div
                className="show-html"
                dangerouslySetInnerHTML={{ __html: markdownContent }}
              >

              </div>

            </Col>
          </Row>

        </Col>

        <Col span={6}>
          <Row>
            <Col span={24}>
              <Button size="large">暂存文章</Button>&nbsp;
              <Button type="primary" size="large" onClick={saveArticle}>发布文章</Button>
              <br />
            </Col>
            <Col span={24}>
              <br />
              <TextArea
                rows={4}
                value={introducemd}
                onChange={changeIntroduce}
                onPressEnter={changeIntroduce}
                placeholder="文章简介"
              />
              <br /><br />
              <div
                className="introduce-html"
                dangerouslySetInnerHTML={{ __html: '文章简介：' + introducehtml }}
              ></div>
            </Col>
            <Col span={12}>
              <div className="date-select">
                <DatePicker showTime
                  onChange={(date, dateString) => setShowDate(dateString)}
                  placeholder="发布日期"
                  size="large"
                />
              </div>
            </Col>

          </Row>

        </Col>
      </Row>
    </div>

  )
}
export default AddArticle